#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Название: ChromeCSVLocales.py
# Описание: Программа для создания файлов локализации интерфейса плагина для Chrome
# Версия:   2.0
#

import os
import pandas as pd


# путь к каталогу с файлами локализации
locale_path = '../lexicon/_locales/'

# путь к CSV-файлу
locale_file = locale_path+'messages.csv'

# читаем данные из CSV-файла игнорируя комментарии
df = pd.read_csv(locale_file, comment='#')

# список языков
langs = list(df.columns)[2:]

# создаем каталоги для каждого из языков, если они еще не созданы
for lang in langs:
    lang_path = locale_path+lang
    if not os.path.exists(lang_path):
        os.mkdir(lang_path)
        print('Create directory: ' + lang_path)

# создаем словарь
json = dict.fromkeys(langs)
for key, value in json.items():
    json[key] = []

# перебираем строки
for j in range(len(df)):
    message = df.loc[j, 'message'].strip()
    description = df.loc[j, 'description'].strip()
    # если ключевое слово или описание отсутствуют, то переходим к следующей строке
    if message is None or description is None:
        continue
    try:
        # перебираем все языки
        for lang in langs:
            translation = df.loc[j, lang].strip()
            # если перевод присутствует, то добавляем информацию в словарь
            if translation is not None:
                json[lang].append('\n  \"%s\": {\n    \"message\": \"%s\",\n    \"description\": \"%s\"\n  }' % (message, translation, description))
    except:
        continue

# записываем результаты из словаря в файлы
for lang in langs:
    lang_file = locale_path+lang+'/messages.json'
    print('Create file: ' + lang_file)
    with open(lang_file, 'w', encoding='utf8') as fd:
        fd.write('{')
        for i, (row) in enumerate(json[lang]):
            if i != len(json[lang])-1:
                row = row+','
            fd.write(row)
        fd.write('\n}\n')

