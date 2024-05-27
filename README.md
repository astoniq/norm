## norm

Упрощённая инфраструктура уведомлений как код

~~~
// http -> workflow worker -> subscriber worker -> echo worker -> message worker

// 1 parse http request
// Поиск клиента по переданному ключу
// Проверка доступа клиента к запуску
// Передача payload
// Передача ресурса
// Передача названия workflow (name)
// Передача subscriber
// Отправка команды на запуск workflow worker в очередь по переданному названию

// 2 workflow worker
// Запуск triggerEvent
// Выбор способа отправки MULTICAST (кому-то) .BROADCAST (всем)
// Формирование списка задач по каждому подписчику
// Отправка команд на запуск subscriber worker по каждому подписчику

// 3 subscriber worker
// Поиск подписчика или создание подписчика 
// Генерирование id уведомления
// Сохранение запроса в базу данных (subscriber, resource, workflow, payload) - notification repository
// Отправка команды на запуск в echo worker с id уведомления

// 4 echo worker
// Отправка команды на запуск workflow
// Получение данных уведомления
// Получением текущего состояния (state)
// Обновление статуса в базе
// Отправка запроса на клиента с учетом state и всех данных
// Получение результата (stepId, сгенерированный ответ outputs)
// Проверка ответа на то что завершен (если завершен, то меняем статус notification: success и завершаем процесс)
// Вычисление delay по результату
// Сохранить новый step с результатом 
// Отправка команды на запуск в message worker c id step, outputs, и дополнительными delay

// 4.1 Workflow
// Получение команды с пустым массивом state или уже с массивом с пройденными этапами
// Проходим по этапам с учетом state (если этап уже есть в state, заполняем и пропускаем)
// Передаем текущее состояние завершенности (status: true, false)
// Проверка порядка выполнения истории state и схемы steps
// Отдаем сгенерированные данные

// 5 message worker
// Поиск step в базе
// Обновление статуса step
// send message
// Сохранение сообщение в базу message repository
// Формирование сообщения
// Отправка сообщения в провайдере
// Обновление статуса step
// Отправка команды на запуск в echo worker с id уведомления
~~~
