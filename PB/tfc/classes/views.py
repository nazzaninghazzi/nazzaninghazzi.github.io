from rest_framework.exceptions import ValidationError
from django.shortcuts import render
import datetime
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from classes.serializers import ClassInstanceSerializer, ScheduleViewSerializer, ClassSearchSerializer

from accounts.models import MyUser, Card, FuturePayment, PreviousPayment
from studios.models import Studio
from classes.models import Classes, ClassInstance, ClassKeywords, Enrollment


# Create your views here.
class ClassDetails(ListAPIView):
    serializer_class = ClassInstanceSerializer

    def get_queryset(self):
        ordered_classes = []
        wanted_studio = Studio.objects.filter(id=self.kwargs['studio_id'])
        if not wanted_studio.exists():
            raise ValidationError('404 NOT FOUND')
        wanted_studio = wanted_studio.first()
        classes = Classes.objects.filter(studio=wanted_studio)
        class_instances = []
        for class_ in classes:
            class_instance = ClassInstance.objects.filter(class_id=class_)
            for ci in class_instance:
                class_instances.append(ci)
        class_times = []
        for class_instance in class_instances:
            class_instance_time = datetime.datetime.combine(class_instance.date, class_instance.class_id.start_time)
            if class_instance_time >= datetime.datetime.today():
                class_times.append(class_instance_time)
        class_times = sorted(class_times)
        for class_time in class_times:
            for class_instance in class_instances:
                if datetime.datetime.combine(class_instance.date, class_instance.class_id.start_time) \
                        == class_time:
                    ordered_classes.append(class_instance)
        res = []
        alreadyAdded = []
        for class_instance in ordered_classes:
            if class_instance.id in alreadyAdded:
                continue
            class_ = class_instance.class_id
            try:
                class_kw = ClassKeywords.objects.get(class_id=class_).keyword
            except ClassKeywords.DoesNotExist:
                class_kw = 'none'
            alreadyAdded.append(class_instance.id)
            res.append({
                'id': class_instance.id,
                'name': class_.name,
                'description': class_.description,
                'keywords': class_kw,
                'coach': class_.coach,
                'date': class_instance.date,
                'start_time': class_.start_time,
                'capacity': class_.capacity,
                'num_signed_up': class_instance.num_signed_up,
                'length': class_.length
            })
        return res


class EnrollmentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def enroll_in_one_class(self, class_id, date_):
        class_ = Classes.objects.get(id=class_id)
        all_ci = ClassInstance.objects.filter(class_id=class_, date=date_)
        if not all_ci.exists():
            return {'The corresponding class is not offered on that date'}
        ci = ClassInstance.objects.get(class_id=class_, date=date_)
        n_s_u = ci.num_signed_up
        ub = ci.class_id.capacity
        dt = ci.date
        date = datetime.datetime.combine(dt, ci.class_id.start_time)# datetime.datetime.min.time())
        if n_s_u >= ub:
            raise ValidationError({'This class is full'})
        elif date < datetime.datetime.today():
            raise ValidationError({'This class has already happened'})
        elif Enrollment.objects.filter(user=self.request.user, class_instance=ci, date=date, dropped=False).count() > 0:
            return {"You are already enrolled in the specified class"}
        else:
            n_s_u += 1
            ci.num_signed_up = n_s_u
            ci.save()
            user = self.request.user
            enrollment = Enrollment.objects.create(user=user, class_instance=ci, date=date)
            return {"enrollment_id": enrollment.id,
                    "user": user.username,
                    "class": class_.name,
                    "date": date}

    def enroll_in_all_future_classes(self, class_id):
        class_ = Classes.objects.get(id=class_id)
        class_instances = ClassInstance.objects.filter(class_id=class_)
        res = []
        for ci in class_instances:
            n_s_u = ci.num_signed_up
            ub = class_.capacity
            date_ = datetime.datetime.combine(ci.date, ci.class_id.start_time)
            if n_s_u >= ub and date_ > datetime.datetime.today():
                res.append({f'The {class_.name} class on the {ci.date} is full. \
                You have not been enrolled in it.'})
            elif Enrollment.objects.filter(user=self.request.user, class_instance=ci, date=ci.date, dropped=False).count() > 0:
                res.append({f'You are already enrolled in the {class_.name} class on {ci.date}'})
            elif n_s_u < ub and date_ > datetime.datetime.today():
                n_s_u += 1
                ci.num_signed_up = n_s_u
                ci.save()
                # Enrollment.objects.create(user=self.request.user, class_instance=ci, date=ci.date)
                enrollment = Enrollment.objects.create(user=self.request.user, class_instance=ci, date=ci.date)
                res.append({"enrollment_id": enrollment.id,
                            "user": self.request.user.username,
                            "class": class_.name,
                            "date": ci.date})
        if len(res) == 0:
            raise ValidationError({f'There are no future classes that have any space. Apologies for the inconvenience.'})
        return {"enrolled_classes": res}

    def post(self, request, *args, **kwargs):
        if self.request.user.subscription is None:
            raise PermissionDenied('You must have a valid subscription to enrol in a class')
        date_ = request.POST.get('date', None)
        ci_id = request.POST.get('class_instance_id', None)
        class_ = ClassInstance.objects.filter(id=ci_id).exists()
        if not class_:
            raise ValidationError({"Invalid class_instance_id provided"})
        class_id = ClassInstance.objects.get(id=ci_id).class_id.id
        if date_:
            response = self.enroll_in_one_class(class_id, date_)
        else:
            response = self.enroll_in_all_future_classes(class_id)
        return Response(response)


class EnrollmentDropView(APIView):
    permission_classes = [IsAuthenticated]

    def drop_one_class(self, class_id, date_):
        class_ = Classes.objects.get(id=class_id)
        ci = ClassInstance.objects.get(class_id=class_, date=date_)
        class_name = class_.name
        n_s_u = ci.num_signed_up
        date_ = ci.date
        user_ = self.request.user
        if n_s_u > 0:
            n_s_u -= 1
        enrollment = Enrollment.objects.get(user=user_, class_instance=ci)
        enrollment.dropped = True
        enrollment.save()
        return {f'You have dropped the class: {class_name}, on {date_}'}

    def drop_all_future_classes(self, class_id):
        class_ = Classes.objects.get(id=class_id)
        res = []
        class_instances = ClassInstance.objects.filter(class_id=class_)
        for ci in class_instances:
            n_s_u = ci.num_signed_up
            date_ = datetime.datetime.combine(ci.date, datetime.datetime.min.time())
            if date_ < datetime.datetime.today():
                res.append({f'The {class_.name} class on the {ci.date} has already happened.' +
                            f' You cannot drop this class.'})
            else:
                try:
                    enrollment = Enrollment.objects.get(user=self.request.user, class_instance=ci, dropped=False)
                except Enrollment.DoesNotExist:
                    enrollment = None
                if enrollment:
                    n_s_u -= 1
                    enrollment.dropped = True
                    enrollment.save()
                    res.append({"status": f'{self.request.user.username} has dropped the class {class_.name} ' +
                                          f'on {ci.date}'})
        if len(res) == 0:
            res.append({f'There are no future classes that you are able to drop.'})
        return {"dropped_classes": res}

    def post(self, request, *args, **kwargs):
        if self.request.user.subscription is None:
            raise PermissionDenied('You must have a valid subscription to enrol in a class')
        dt = request.data.get('date', None)
        ci_id = request.data.get('class_instance_id', None)
        class_ = ClassInstance.objects.filter(id=ci_id).exists()
        if not class_:
            return Response({"Invalid class_instance_id provided"})
        class_id = ClassInstance.objects.get(id=ci_id).class_id.id
        if dt:
            date_ = datetime.datetime.strptime(dt, '%Y-%m-%d')
            classes_left = Enrollment.objects.filter(user=self.request.user, date=date_)
            if date_ < datetime.datetime.today():
                raise PermissionDenied('This class has already occurred and cannot be dropped')
            if classes_left.exists():
                result = self.drop_one_class(class_id, date_)
            else:
                raise PermissionDenied('You cannot drop this class as you are not enrolled in it.')

        else:
            result = self.drop_all_future_classes(class_id)
        return Response(result)


class EnrollmentScheduleView(APIView):
    serializer_class = ScheduleViewSerializer
    def get(self, request, *args, **kwargs):
        return Response(self.get_queryset())
    def get_queryset(self):
        res = []
        future_classes = []
        future_class_dates = []
        scheduled_classes = Enrollment.objects.filter(user=self.request.user, dropped=False)
        for sc in scheduled_classes:
            class_ = Classes.objects.get(id=sc.class_instance.class_id.id)
            date_ = datetime.datetime.combine(sc.date, class_.start_time)
            if date_ > datetime.datetime.today():
                future_classes.append(sc)
        for fc in future_classes:
            future_class_dates.append(fc.date)
        future_class_dates = sorted(future_class_dates)
        for fcd in future_class_dates:
            for fc in future_classes:
                if fc.date == fcd:
                    class_name = fc.class_instance.class_id.name
                    res.append({'class_instance_id': fc.class_instance.id,
                                'class_name': class_name,
                                'studio_name': fc.class_instance.class_id.studio.name,
                                'studio_id': fc.class_instance.class_id.studio.id,
                                'date': fc.date,
                                'time': fc.class_instance.class_id.start_time,
                                'alerts': fc.class_instance.alerts})
        return res


class EnrollmentHistoryView(ListAPIView):
    serializer_class = ScheduleViewSerializer
    def get_queryset(self):
        res = []
        past_classes = []
        past_class_dates = []
        previous_classes = Enrollment.objects.filter(user=self.request.user, dropped=False)
        for pc in previous_classes:
            class_ = Classes.objects.get(id=pc.class_instance.class_id.id)
            date_ = datetime.datetime.combine(pc.date, class_.start_time)
            if date_ < datetime.datetime.today():
                past_classes.append(pc)
        for pc in past_classes:
            past_class_dates.append(pc.date)
        past_class_dates = sorted(past_class_dates)
        for pcd in past_class_dates:
            for pc in past_classes:
                if pc.date == pcd:
                    class_name = pc.class_instance.class_id.name
                    res.append({"class_instance_id": pc.class_instance.id,
                                'class_name': class_name,
                                'studio_name': pc.class_instance.class_id.studio.name,
                                'studio_id': pc.class_instance.class_id.studio.id,
                                'date': pc.date,
                                'time': pc.class_instance.class_id.start_time,
                                'alerts': pc.class_instance.alerts})
        return res


class ClassSearch(ListAPIView):
    serializer_class = ClassSearchSerializer
    def get_queryset(self):
        studio_id = self.request.GET.get('studio_id', None)
        if not studio_id:
            raise ValidationError({'no id provided': 'You must provide a studio_id'})
        if not Studio.objects.filter(id=studio_id).exists():
            raise ValidationError({'id does not exist': 'The studio_id provided does not exist'})
        studio_ = Studio.objects.get(id=studio_id)
        class_names = self.request.GET.get('class_names', None)
        class_names = class_names.split(',') if class_names else None
        coaches = self.request.GET.get('coach', None)
        coaches = coaches.split(',') if coaches else None
        date_ = self.request.GET.get('date', None)
        date_ = datetime.datetime.strptime(date_, '%Y-%m-%d') if date_ else None
        time_range = self.request.GET.get('time_range', None)
        time_range = time_range.split(',') if time_range else None
        time_range = sorted(time_range) if time_range else None
        if time_range:
            time_range[0] = datetime.datetime.strptime(time_range[0], '%H:%M:%S').time() if time_range else None
            time_range[1] = datetime.datetime.strptime(time_range[1], '%H:%M:%S').time() if time_range else None

        # obtaining class instances with desired studio
        classes_with_studio_id = set()
        classes_instances_with_studio_id = set()
        qs_classes_with_studio_id = Classes.objects.filter(studio=studio_)
        for class_ in qs_classes_with_studio_id:
            classes_with_studio_id.add(class_)
        for class_ in classes_with_studio_id:
            qs_ci_with_studio_id = ClassInstance.objects.filter(class_id=class_)
            for ci in qs_ci_with_studio_id:
                classes_instances_with_studio_id.add(ci.id)

        # obtaining class instances with desired name
        classes_instances_with_name = set()
        if class_names:
            for class_name in class_names:
                classes_with_name = Classes.objects.filter(name=class_name, studio=studio_)
                for class_with_name in classes_with_name:
                    class_instances = ClassInstance.objects.filter(class_id=class_with_name)
                    for ci in class_instances:
                        classes_instances_with_name.add(ci.id)

        # obtaining class instances with desired coaches
        class_instances_with_coach = set()
        if coaches:
            for coach_ in coaches:
                classes_with_coach = Classes.objects.filter(coach=coach_, studio=studio_)
                for class_ in classes_with_coach:
                    class_instances = ClassInstance.objects.filter(class_id=class_)
                    for ci in class_instances:
                        class_instances_with_coach.add(ci.id)

        # obtaining class instances with desired date
        class_instances_with_date = set()
        if date_:
            class_instances_on_date = ClassInstance.objects.filter(date=date_)
            for ci in class_instances_on_date:
                class_instances_with_date.add(ci.id)

        # obtaining class instances with desired time range
        class_instances_in_time_range = set()
        if time_range:
            all_class_instances = ClassInstance.objects.all()
            for ci in all_class_instances:
                parent_class = ci.class_id
                lb = datetime.datetime.combine(ci.date, parent_class.start_time)
                ub = datetime.datetime.combine(ci.date, parent_class.start_time) \
                     + datetime.timedelta(minutes=parent_class.length)
                tr_0 = datetime.datetime.combine(ci.date, time_range[0])
                tr_1 = datetime.datetime.combine(ci.date, time_range[1])
                if tr_0 <= lb < ub <= tr_1:
                    class_instances_in_time_range.add(ci.id)

        # taking the intersection of all our class instances ignoring empty sets
        wanted_class_instances_ids = set()

        wanted_class_instances_ids = classes_instances_with_studio_id.union(classes_instances_with_name, class_instances_with_coach, class_instances_with_date, class_instances_in_time_range)
        if class_names:
            wanted_class_instances_ids = wanted_class_instances_ids.intersection(classes_instances_with_name)
        if time_range:
            wanted_class_instances_ids = wanted_class_instances_ids.intersection(class_instances_in_time_range)
        if coaches:
            wanted_class_instances_ids = wanted_class_instances_ids.intersection(class_instances_with_coach)
        if date_:
            wanted_class_instances_ids = wanted_class_instances_ids.intersection(class_instances_with_date)

        res = []
        if wanted_class_instances_ids:
            wanted_class_instances = ClassInstance.objects.filter(pk__in=wanted_class_instances_ids)
            for ci in wanted_class_instances:
                name_ = ci.class_id.name
                free_spots = ci.class_id.capacity - ci.num_signed_up
                start_time = datetime.datetime.combine(ci.date, ci.class_id.start_time)
                end_time = start_time + datetime.timedelta(minutes=ci.class_id.length)
                res.append({'class_instance_id': ci.id,
                            'class_name': name_,
                            'description': ci.class_id.description,
                            'date': ci.date,
                            'start_time': start_time,
                            'end_time': end_time,
                            'coach': ci.class_id.coach,
                            'free_spots': free_spots})
        return res
