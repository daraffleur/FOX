# Generated by Django 3.1 on 2020-09-10 05:57

import back.models.permit
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0033_remove_document_target_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='permit',
            name='qr_code',
            field=models.ImageField(blank=True, null=True, upload_to=back.models.permit.project_qr_code_path),
        ),
    ]
