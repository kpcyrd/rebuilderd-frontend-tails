document.addEventListener('DOMContentLoaded', function() {
    let data = [
        { build_id: 1337, name: 'foo.img', version: '1', status: 'GOOD' },
        { build_id: 1338, name: 'foo.iso', version: '1', status: 'BAD' },
    ];

    let div = document.getElementById('results');

    // clear children
    div.innerHTML = '';

    function spanWith(text) {
        let s = document.createElement('span');
        s.textContent = text;
        return s;
    }

    function linkTo(href, text) {
        let a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        return a;
    }

    fetch('/api/v0/pkgs/list?distro=tails')
        .then(response => response.json())
        .then(data => {
            data.map(pkg => {
                let build_id = pkg.build_id;
                let r = document.createElement('pre');

                r.appendChild(spanWith('['));
                let status = pkg['status'];
                let statusSpan = spanWith(status.padEnd(5));
                statusSpan.className += ' status';
                if (status == 'GOOD') {
                    statusSpan.className += ' good';
                } else if (status == 'BAD') {
                    statusSpan.className += ' bad';
                } else {
                    statusSpan.className += ' unknown';
                }
                r.appendChild(statusSpan);
                r.appendChild(spanWith(`] ${pkg['name']} ${pkg['version']}`.padEnd(45)));

                if (build_id) {
                    r.appendChild(spanWith(' ['));
                    r.appendChild(linkTo(`/api/v0/builds/${build_id}/log`, 'log'));
                    r.appendChild(spanWith(']'));
                }

                if (pkg.has_attestation) {
                    r.appendChild(spanWith(' ['));
                    r.appendChild(linkTo(`/api/v0/builds/${build_id}/attestation`, 'attestation'));
                    r.appendChild(spanWith(']'));
                }

                if (pkg.has_diffoscope) {
                    r.appendChild(spanWith(' ['));
                    r.appendChild(linkTo(`/api/v0/builds/${build_id}/diffoscope`, 'diffoscope'));
                    r.appendChild(spanWith(']'));
                }

                div.appendChild(r);
            });
        });

    console.log('loaded');
});
