import {AuthedRouter, RouterInitArgs} from "./types.js";

export default function eventRoutes<T extends AuthedRouter>(...[router]: RouterInitArgs<T>) {

    router.post(
        '/events/trigger',
        async (_ctx, next) => {

            // http -> workflow worker -> subscriber worker -> echo worker -> message worker

            // 1 parse http request
            // Поиск клиента по переданному ключу
            // Передача payload
            // Передача клиента
            // Передача subscriber
            // Отправка команды на запуск workflow worker в очередь по переданному названию

            // 2 workflow worker
            // Запуск triggerEvent
            // Поиск клиента
            // Выбор способа отправки MULTICAST (кому то) .BROADCAST (всем)
            // Формирование списка задач по каждому подписчику
            // Отправка команд на запуск subscriber worker по каждому подписчику

            // 3 subscriber worker
            // Поиск клиента
            // Поиск подписчика
            // Генерирование id уведомления
            // Сохранение запроса в базу данных (subscriber, client, workflow, payload) - notification repository
            // Отправка команды на запуск в echo worker с id уведомления

            // 4 echo worker
            // Отправка команды на запуск workflow
            // Получение данных уведомления
            // Получением текущего состояния (state)
            // Обновление статуса в базе
            // Отправка запроса на клиента с учетом state и всех данных
            // Получение результата (stepId, сгенерированный ответ outputs)
            // Сохранить результат
            // Отправка команды на запуск в message worker c id step и дополнительными delay

            // 4.1 Workflow
            // Получение команды с пустым массивом state или уже с массивом с пройденными этапами
            // Проходим по этапам с учетом state (если этап уже есть в state, заполняем и пропускаем)
            // Передаем текущее состояние позиции с доступными впереди этапами (только те которые впереди) по количеству
            // Отдаем сгенерированные данные

            // 5 message worker
            // Поиск step в базе
            // Обновление статуса step
            // send message
            // Сохранение сообщение в базу message repository
            // Формирование сообщения
            // Отправка сообщения в провайдере
            // Обновление статуса step
            // Проверка, что есть следующая команда на запуск
            // Отправка команды на запуск в echo worker с id уведомления


            return next()
        }
    )

    router.post(
        '/events/trigger/bulk',
        async (_ctx, next) => {

            return next()
        }
    )

    router.post(
        '/events/trigger/broadcast',
        async (_ctx, next) => {

            return next();
        }
    )
}