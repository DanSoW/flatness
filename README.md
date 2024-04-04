## Flatness App - Проект онлайн-презентаций

#### так же необходимо создать каталог в корне виртуальной машины для хранения файлов резервных копий базы данных
    mkdir -p /flatness/backup/
    chmod 777 /flatness/backup/

#### для хранения сертификатов необходим фаил acme.json
    touch /flatness/acme.json
    chmod 600 /flatness/acme.json

#### сборка образов server и client описывается в Dockerfile, которые распологаются в одноименных каталогах

#### сборка приложение
    docker-compose -f docker-compose-development.yml build --no-cache

#### запуск приложения
    docker-compose -f docker-compose-development.yml up -d
