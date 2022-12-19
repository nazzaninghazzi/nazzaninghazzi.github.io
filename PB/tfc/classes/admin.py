from django.contrib import admin
from .models import ClassInstance, Classes, ClassKeywords, ClassesAdmin, Enrollment
# Register your models here.

admin.site.register(ClassInstance)
admin.site.register(Classes, ClassesAdmin)
admin.site.register(ClassKeywords)
admin.site.register(Enrollment)
