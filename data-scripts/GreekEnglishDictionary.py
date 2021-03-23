#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Название: GreekEnglishDictionary.py
# Описание: Программа для создания Греко-Английского словаря на основе XML-файлов
# Версия:   2.0
#
# Установка библиотек:
#  pip install BeautifulSoup4
#  pip install bs4 lxml

from bs4 import BeautifulSoup
import string
import re
from xml.sax.saxutils import escape
import xml.etree.ElementTree as ET


#-------------------------------------------------------
# функция обработки строки: удаление запятых и пробелов
#-------------------------------------------------------
def parse(text):
    # если запятая стоит в конце строки, то заменяем на точку
    text = re.sub(r'(,)(?=$)', r'.', text)
    # если встречается несколько запятых подряд, то оставляем только одну
    text = re.sub(r'(,){2,}', r', ', text)
    # если после запятой не идет буква, то удаляем запятую
    pattern = '(,)(\s*[{}]+)'.format(re.escape(string.punctuation))
    text = re.sub(pattern, r'\2', text)
    # если перед запятой есть пробелы, то удаляем их
    text = re.sub(r'\s+,', r',', text)
    # если перед запятой есть символ "точка с запятой", то удаляем запятую
    text = re.sub(r'([;]+)(,)', r'\1', text)
    # если идет несколько точек подряд, то оставляем одну точку
    text = re.sub(r'[.]+', r'.', text)
    # если есть пробел между символом буквы и символом "точка" или "точка с запятой", то удаляем его
    text = re.sub(r'(\w)\s+([.;]+)', r'\1\2', text)
    # если между символами "точка" и "точка с запятой" есть пробел, то удаляем его
    text = re.sub(r'([.]+)\s+([;]+)', r'\1\2', text)
    # заменяем несколько пробелов одним пробелом
    text = re.sub(r'\s+', r' ', text)
    # если встречается символ "двойная кавычка", то заменяем на символ "одинарная кавычка"
    text = re.sub(r'["]', r'\'', text)
    # если встречается символ "обратный слеш", то удаляем его
    text = re.sub(r'[\\]', r'', text)
    return text

# флаг режима отладки
DEBUG = False

# список имен входных файлов
file_names = ['Autenrieth.xml', 'MiddleLiddell.xml', 'LiddellScott.xml']

# имена выходных файлов
out_js_file_name = 'meanings.js'
out_xml_file_name = 'meanings.xml'

# список словарей
dictionaries = []

# перебираем все файлы по очереди
for i, file_name in enumerate(file_names):
    try:
        # открываем файл
        fd = open(file_name)
        # загружаем данные
        soup = BeautifulSoup(fd, 'xml')
        # находим все теги
        items = soup.findAll('entryFree') + soup.findAll('entry')
        # отображаем инфомрацию на консоле
        print('File %s contains %s items' % (file_name, len(items)))
        # создаем словарь
        dictionaries.append({})
        # перебираем все найденные теги
        for item in items:
            lemma = item.get('key').strip()
            # если в key ничего не указано, то переходим к следующему тегу
            if len(lemma) == 0:
                continue
            english = ''.join(' '+' '.join(child.get_text().split()) for child in item.findChildren(recursive=True)).strip()
            # сохраняем результат
            dictionaries[i][lemma] = parse(english)
            if DEBUG:
                print('=======================')
                print(lemma)
                print('=======================')
                print(english)
                print('=======================')
                print(dictionaries[i][lemma])
                print('=======================')
                for child in item.findChildren(recursive=True):
                    print(child)
                    print('---------------------')
                    print(child.get_text())
                    print('---------------------')
    except:
        print('File %s not found in current directory' % file_name)
        continue

# объединяем словари
dd = {}
for i, dictionary in enumerate(dictionaries):
    print('Dictionary #%d: %d items' % (i+1, len(dictionary)))
    for key, value in dictionary.items():
        if key in dd.keys():
            dd[key] = dd[key] + '\\r\\n\\r\\n' + value
        else:
            dd[key] = value
print('Merged dictionary contains %d items' % len(dd))

# записываем словарь в JS-файл
fd = open(out_js_file_name, 'w')
fd.write('const meanings = [')
for i, (key, value) in enumerate(dd.items()):
    if i == 0:
        fd.write('\r\n["%s", "%s"]' % (key, value))
    else:
        fd.write(',\r\n["%s", "%s"]' % (key, value))
fd.write('];\r\n')
fd.write('\r\n')
fd.write('module.exports = meanings;\r\n')
fd.close()

# записываем словарь в XML-файл
fd = open(out_xml_file_name, 'w')
fd.write('<?xml version="1.0" encoding="utf-8"?>\r\n')
fd.write('<entries>')
for key, value in dd.items():
    # заменяем символы окончания строки
    value = re.sub(r'\\r\\n', r'\r\n', value)
    # перед записью в XML-файл недопустимые символы "меньше" и "больше" заменяются на &gt; и &lt;
    fd.write('\r\n<entry key="%s">%s</entry>' % (escape(key), escape(value)))
fd.write('\r\n')
fd.write('</entries>\r\n')
fd.close()

# тестируем XML-файл
try:
    tree = ET.parse(out_xml_file_name)
    root = tree.getroot()
    print('The format of %s file is correct' % out_xml_file_name)
except:
    print('The format of %s file is wrong' % out_xml_file_name)
