from django.core.validators import MinValueValidator
from django.db import models


STATUS_NEW = 'new'
STATUS_MODERATED = 'moderated'
STATUS_CHOICES = (
    (STATUS_NEW, 'Новая'),
    (STATUS_MODERATED, 'Модерированная')
)
DEFAULT_STATUS = STATUS_NEW


class Quote(models.Model):
    text = models.TextField(max_length=2000, verbose_name='Текст')
    author = models.CharField(max_length=100, verbose_name='Автор цитаты')
    email = models.EmailField(max_length=100, verbose_name='Почта')
    rating = models.IntegerField(verbose_name='Рейтинг', default=0)
    status = models.CharField(max_length=100, verbose_name='Статус', choices=STATUS_CHOICES, default=STATUS_NEW)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Время создания')

    @classmethod
    def get_moderated(cls):
        return cls.objects.filter(status=STATUS_MODERATED)

    def __str__(self):
        return f'{self.author} - {self.text}'

    class Meta:
        verbose_name = 'Цитата'
        verbose_name_plural = 'Цитаты'


class Vote(models.Model):
    quote = models.ForeignKey('webapp.Quote', related_name='voutes', verbose_name='Цитата', on_delete=models.CASCADE)
    session_key = models.CharField(max_length=40, verbose_name='Ключ сессии')
    rating = models.IntegerField(choices=((1, 'up'), (-1, 'down')), verbose_name='Рейтинг')

    def __str__(self):
        return f'{self.quote}: {self.rating}'

    class Meta:
        verbose_name = 'Рейтинг'
        verbose_name_plural = 'Рейтинги'
        ordering = ('quote', 'rating')