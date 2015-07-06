
class upstart {

    file { "/etc/init/sbiars.conf":
        ensure  => file,
        source  => "puppet:///files/sbiars.conf",
        require => Class["Nodejs"],
    }

    service { 'app':
        ensure => running,
        provider => 'upstart',
        require => File['/etc/init/sbiars.conf'],
    }

}

