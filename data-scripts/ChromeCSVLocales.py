#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Название: Locale.py
# Описание: Программа для создания файлов локализации интерфейса плагина для Chrome
# Версия:   1.0
#

import os


# путь к каталогу с файлами локализации
locale_path = '../lexicon/locales/'

# путь к CSV-файлу
locale_file = locale_path+'messages.csv'

# список языков
langs = ['ru', 'el', 'en', 'lat']

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

# читаем данные из CSV-файла и заполняем словарь
with open(locale_file, 'r', encoding='utf-8') as f:
    # перебираем строки
    for j, (line) in enumerate(f):
        # разбиваем строку на слова
        words = line.split(',')
        # если строка пустая или первая, то пропускаем
        if len(words) == 0 or j == 0:
            continue        
        try:
            # перебираем все языки
            for i, (lang) in enumerate(langs):
                json[lang].append('\n  \"%s\": {\n    \"message\": \"%s\",\n    \"description\": \"%s\"\n  }' % (words[0].strip(), words[2+i].strip(), words[1].strip()))
        except:
            continue

# записываем результаты из словаря в файлы
for lang in langs:
    lang_file = locale_path+lang+'/messages.json'
    print('Create file: ' + lang_file)
    with open(lang_file, 'w') as fd:
        fd.write('{')
        for i, (row) in enumerate(json[lang]):
            if i != len(json[lang])-1:
                row = row+','
            fd.write(row)
        fd.write('\n}\n')
