from django.core.validators import MinValueValidator
from django.db import models


CATEGORY_CHOICES = (
    ('new', 'Новая'),
    ('moderated', 'Модерированая')
)


class Quote(models.Model):
    text = models.TextField(max_length=2000, verbose_name='Текст')
    author = models.CharField(max_length=100, verbose_name='Автор цитаты')
    email = models.EmailField(max_length=100, verbose_name='Почта')
    rating = models.IntegerField(verbose_name='Рейтинг', default=0, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=100, verbose_name='Статус', choices=CATEGORY_CHOICES, default='new')

    def __str__(self):
        return f'{self.author} - {self.text}'

    class Meta:
        verbose_name = 'Цитата'
        verbose_name_plural = 'Цитаты'
