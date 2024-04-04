## Flatness App - Проект онлайн-презентаций

#### Необходимо создать каталог в корне виртуальной машины для хранения файлов резервных копий базы данных
    mkdir -p /flatness/backup/
    chmod 777 /flatness/backup/

#### Для хранения сертификатов необходим фаил acme.json
    touch /flatness/acme.json
    chmod 600 /flatness/acme.json

#### Сборка образов server и client описывается в Dockerfile, которые распологаются в одноименных каталогах

#### Сборка приложение
    docker-compose -f docker-compose-development.yml build --no-cache

#### Запуск приложения
    docker-compose -f docker-compose-development.yml up -d
