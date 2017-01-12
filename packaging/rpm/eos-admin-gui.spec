Name:           eos-admin-gui
Version:        0.1.0
Release:        1%{?dist}
Summary:        Web Interface for EOS administration 
Group:          Applications/Internet
License:        ASL 2.0
URL:            https://gitlab.cern.ch/eos/eos-admin-gui
# The source for this package was pulled from upstream's vcs.  Use the
# following commands to generate the tarball:
#  git clone https://gitlab.cern.ch/fts/webfts.git webfts-2.2.8
#  tar --exclude-vcs -zcvf webfts-2.2.8.tar.gz webfts-2.2.8
Source:         %{name}-%{version}.tar.gz
BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
BuildArchitectures: x86_64

Requires:	httpd

%description
The package provides the WEB Interface for the EOS service admnistraton

%prep
%setup -c -n %{name}

%install
rm -rf %{buildroot}
mkdir -p -m0755 %{buildroot}/var
mkdir -p -m0755 %{buildroot}/var/www
mkdir -p -m0755 %{buildroot}/var/www/%{name}

cp -rp %{name}-%{version}/* %{buildroot}/var/www/%{name}

mkdir -p -m0755 %{buildroot}/etc
mkdir -p -m0755 %{buildroot}/etc/httpd
mkdir -p -m0755 %{buildroot}/etc/httpd/conf.d

cp -rp %{name}-%{version}/etc/%{name}.conf %{buildroot}/etc/httpd/conf.d/

%clean
rm -rf %{buildroot}

%post
service httpd restart

%files
%config(noreplace) /etc/httpd/conf.d/%{name}.conf
%defattr(-,root,root,-)
/var/www/%{name}

%changelog
* Thu Jan 12 2017 Andrea Manzi <amanzi@cern.ch> - 0.1.0-1
- first version
