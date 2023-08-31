Код состояния указывает на результат выполнения HTTP-запроса и состояние ресурса на сервере.

200 (OK) - этот код состояния обозначает успешное выполнение запроса и возвращение запрашиваемых данных. Когда вы запрашиваете веб-страницу, вам возвращается код 200, если страница успешно загружена. Еще пример если вы запрашиваете данные с помощью GET запроса, вам возвращаются данные о товаре и код ответа в этом случае будет 200.

201 (Created) - этот код состояния обозначает успешное создание нового ресурса. Он используется, когда вы отправляете данные на сервер и они успешно создают новый объект. К примеру вы хотите добавить новый товар в базу данных, отправляете POST запрос с данными о товаре в ответ сервер вернет 201 статус и информацию о новом товаре, например он дополнится ссылкой на изображение и id

204 (No Content) - этот код состояния обозначает успешное выполнение запроса, но без возвращения каких-либо данных. Он используется, когда вы отправляете запрос, который выполняет некоторое действие, но не требуется возвращать данные. Пример: вы хотите удалить товар или картинку у товара, для этого используете метод DELETE и в ответ получаете статус 204 без данных

400 (Bad Request) - этот код состояния обозначает, что запрос некорректен и не может быть выполнен. Он может быть вызван, например, если запрос отправлен с недопустимыми параметрами. Пример, вы пытаетесь получить данные о товаре, но передаете некорректный id, в ответ сервер вернет статус 400.

401 (Unauthorized) - этот код состояния обозначает, что для доступа к запрашиваемому ресурсу необходима авторизация. То есть сервер не будет выполнять запрос, если вы не предоставите правильные учетные данные. Если пытаетесь получить или отправить данные, но для этого необходима авторизация.

403 (Forbidden) - этот код состояния обозначает, что сервер понимает запрос, но отказывается его выполнять. Это может быть вызвано, например, если у вас нет прав для доступа к запрашиваемому ресурсу. Например вы запрашиваете данные для коотрых нужно быть администратором или нужно подтвердить регистрацию.

404 (Not Found) - этот код состояния обозначает, что запрашиваемый ресурс не найден на сервере. Он может быть вызван, например, если вы запрашиваете страницу, которая была удалена или перемещена, а так же например если вы пытаетесь получить товар по id, но такого товара в базе нет. Разница между 400 в том что id введен валидный.

500 (Internal Server Error) - этот код состояния обозначает, что на стороне сервера произошла ошибка при выполнении запроса. Он может быть вызван, например, если сервер не может выполнить запрос из-за ошибки в коде. Это та ошибка которую пользователь не должен видеть, если вы хороший программист и протестировали своё сервер на все баги и возможные проблемы. Если на сервере возникла ошибка, скорее всего он упал, то в ответе будет 500 ошибка
