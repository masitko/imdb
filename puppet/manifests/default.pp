
$user = 'vagrant'

$home = "/home/${user}"

#defines default values for subsequent calls of exec
Exec {
    path => ['/bin', '/sbin', '/usr/bin', '/usr/sbin', '/usr/local/bin'],
#    user => $user,
#    cwd => $home,
    logoutput => 'on_failure',
    timeout => 0,
}

Service {
    ensure => running,
    enable => true,
}

#defines default values for subsequent calls of package
Package {
    ensure => latest,
}


# --- Preinstall Stage ---#

stage { 'preinstall':
    before => Stage['main']
}


class apt_get_update {

  exec { "apt-get-update":
    command => "apt-get -y update"
  }
}

class { 'apt_get_update':
  stage => preinstall
}


class apache {
    package { "apache2": }

    service { "apache2":
        require => Package["apache2"],
    }
}

class curl {
  package { "curl": ensure => present }
}

class git {
  package { "git": }
}

class php {
  package { "php5": }

package { "php5-cli":  }

package { "php5-mysql": }

package { "libapache2-mod-php5": }

package { "php5-curl": }

package { "php5-gd": }

package { "php5-dev": }

package { "php-pear": }

}

class php::pecl {
    include php
     exec { "pecl install mongo":
    require => Package["php-pear", "php5-dev"]
    }
}

class mysql {
  package { "mysql-server": }

service { "mysql":
    require => Package["mysql-server"],
  }

exec { "set-mysql-password":
    unless  => "mysql -uroot -prootpass",
#    path    => ["/bin", "/usr/bin"],
    command => "mysqladmin -uroot password rootpass; mysql -uroot -prootpass -e \"create database quiz;\"",
    require => Service["mysql"],
}

#exec {'create-sbiars-database':
#    command => 'mysql -u root -prootpass -e "CREATE DATABASE sbiars DEFAULT CHARACTER SET = \'utf8\';"',
#    user    => root,
#    unless  => 'mysql -u root information_schema -e "select * from information_schema.schemata;" | grep "sbiars"',
#    require => Exec["set-mysql-password"],
#}

}

class groups {
  group { "puppet": }
}

#class { 'nodejs':
#  version => 'stable',
#}

#class socket_io {
#  exec { "install_socket_io":
#    path    => ["/usr/local/node/node-default/bin" ],
#    command => "/usr/local/node/node-default/bin/npm install --prefix /usr/lib/node_modules socket.io",
#    require => Class["nodejs"],
#  }
#}

#class upstart {

#    file { "/etc/init/sbiars.conf":
#        ensure  => file,
#        source  => "puppet:///files/sbiars.conf",
#        require => Class["socket_io"],
#        require => Class["nodejs"],
#    }

#    service { 'sbiars':
#        ensure => running,
#        provider => 'upstart',
#        require => File['/etc/init/sbiars.conf'],
#    }

#}

class mongodb {
    exec { "import_public_key":
        command => "apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10",
    }
    exec { "create_list_file":
        command => 'echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list',
        require => Exec["import_public_key"],
    }
    exec { "reload_packages":
        command => "apt-get update",
        require => Exec["create_list_file"],
    }
    exec { "install_mongodb":
        command => "apt-get install -y mongodb-org",
        require => Exec["reload_packages"],
    }
    service{ "mongod":
        require => Exec["install_mongodb"],
    }
}

include apache
include curl
include php
include php::pecl
#include mysql
include mongodb
include groups
include git
#include nodejs
#include socket_io
#include upstart

