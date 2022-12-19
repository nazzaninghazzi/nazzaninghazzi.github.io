import datetime
from datetime import timedelta
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import CASCADE, DO_NOTHING
from django.utils import timezone
from studios.models import Studio
from accounts.models import MyUser
from django.contrib.admin import ModelAdmin

DAYS_OF_WEEK = (
    (0, 'Monday'),
    (1, 'Tuesday'),
    (2, 'Wednesday'),
    (3, 'Thursday'),
    (4, 'Friday'),
    (5, 'Saturday'),
    (6, 'Sunday'),
)


class Classes(models.Model):
    # name of the class
    name = models.CharField(max_length=100)
    # description of the class
    description = models.CharField(max_length=500)
    # the coach who teaches the class
    coach = models.CharField(max_length=100)
    # the capacity of the class
    capacity = models.IntegerField(validators = [
        MinValueValidator(0)
    ])
    # the day of the week the class is held
    day = models.IntegerField(choices=DAYS_OF_WEEK)
    # the time the class starts
    start_time = models.TimeField()
    # start date of the class
    start_date = models.DateField()
    # end date of the class
    end_date = models.DateField()
    # length of class (in minutes)
    length = models.IntegerField(validators=[
        MinValueValidator(1)
    ], help_text="Length of class in minutes")
    # the studio where the class is held
    studio = models.ForeignKey(to=Studio, on_delete=CASCADE, related_name='studio', help_text="Studio where class is held. This is an unchangeable required field.")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # add all instances of the class
        days = (self.end_date - self.start_date).days + 1
        for day in range(0, days + 1):
            date = self.start_date + timedelta(days=day)
            if date.weekday() == self.day and not ClassInstance.objects.filter(class_id=self, date=date).exists():
                ClassInstance.objects.create(date=date, class_id=self, num_signed_up=0)

    def __str__(self):
           return str(self.id) + ' ' + self.name


class ClassesAdmin(ModelAdmin):

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['studio']
        else:
            return super().get_readonly_fields(request, obj)

    def save_model(self, request, obj, form, change):
        if change and Classes.objects.filter(id=obj.id).exists():
            # it is an update, and the class already exists
            obj.old_start_date = form.initial['start_date']
            obj.old_end_date = form.initial['end_date']
            obj.old_day = form.initial['day']
            obj.old_start_time = form.initial['start_time']
            obj.old_length = form.initial['length']
            if obj.old_start_time != obj.start_time or obj.old_length != obj.length:
                # the time or length of the class has changed, so we need to update all instances of the class
                classinstances = ClassInstance.objects.filter(class_id=obj)
                for classinstance in classinstances:
                    classinstance.alerts = "The time or length of this class has changed. Please check the new time and length of the class."
                    classinstance.save()
            elif obj.old_day != obj.day:
                # if the day of the week has changed, delete all instances of the class because they technically dont exist anymore
                classinstances = ClassInstance.objects.filter(class_id=obj).delete()
            # if start or end date are changed, then update the ClassInstance table accordingly
            elif obj.old_start_date != obj.start_date or obj.old_end_date != obj.end_date:
                classinstances = ClassInstance.objects.filter(class_id=obj)
                # delete all the classinstances that are not in the new range
                for classinstance in classinstances:
                    if not (obj.start_date <= classinstance.date <= obj.end_date):
                        classinstance.delete()
        # no matter what, save the class, this will create the new ClassInstances if required
        obj.save()


class ClassKeywords(models.Model):
    # the class that the keyword is associated with
    class_id = models.ForeignKey(to=Classes, on_delete=CASCADE, related_name='+')
    # the keyword that is associated with the class
    keyword = models.CharField(max_length=100)

    def __str__(self):
           return str(self.id) + ' ' + self.keyword


class ClassInstanceQuerySet(models.QuerySet):
    def delete(self):
        for obj in self:
            obj.delete()


class ClassInstance(models.Model):
    objects = ClassInstanceQuerySet.as_manager()
    # the class foreign key reference
    class_id = models.ForeignKey(to=Classes, on_delete=CASCADE, related_name='+')
    # the date of the class instance
    date = models.DateField()
    # the number of people who have signed up for the class
    num_signed_up = models.IntegerField(validators = [
        MinValueValidator(0)
    ])
    # alerts in case the start time or length changed
    alerts = models.CharField(max_length=500, default="")

    def delete(self, using=None, keep_parents=False):
        if self.date >= timezone.now().date():
            return super().delete(using, keep_parents)
        else:

            raise Warning("One or more of the selected classes have"
                          " already occurred and cannot be cancelled.\n"
                          "Refresh to go back to admin panel")

    def __str__(self):
       return str(self.class_id.name) + ' ' + str(self.date)


# Model to portray the enrollment of a <MyUser> object in a <ClassInstance>
class Enrollment(models.Model):
    user = models.ForeignKey(to=MyUser, on_delete=CASCADE, related_name='user')
    class_instance = models.ForeignKey(to=ClassInstance, on_delete=CASCADE, related_name='class+')
    date = models.DateField()
    dropped = models.BooleanField(default=False)
