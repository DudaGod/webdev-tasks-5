'use strict';

export default function sendQuery(url, method, body) {
    // console.log(body);
    // const headers = { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' };
    body = JSON.stringify(body);

    const headers = new Headers({'Content-Type': 'application/json; charset=utf-8'});
    // headers.set('Content-Type', 'application/json');

    // var data = new FormData();
    // data.append( "json", JSON.stringify( body ) );

    fetch(url, {method, headers, body})
        .then(res => res.json())
        .then(data => console.dir(data));
}
