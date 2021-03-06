# Generated by Django 2.2 on 2020-10-22 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0003_auto_20201022_1421'),
    ]

    operations = [
        migrations.CreateModel(
            name='Vote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_key', models.CharField(max_length=40, verbose_name='Ключ сессии')),
                ('rating', models.IntegerField(choices=[(1, 'up'), (-1, 'down')], verbose_name='Рейтинг')),
            ],
        ),
    ]
