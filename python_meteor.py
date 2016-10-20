#!/usr/bin/env python
"""
Very simple HTTP server in python.
Usage::
    ./dummy-web-server.py [<port>]
Send a GET request::
    curl http://localhost
Send a HEAD request::
    curl -I http://localhost
Send a POST request::
    curl -d "foo=bar&bin=baz" http://localhost
"""
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
from cgi import parse_header, parse_multipart
from urlparse import parse_qs

class S(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
	self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header('Content-type', 'text/html')
	
        self.end_headers()

    def parse_POST(self):
        length = int(self.headers.getheader('content-length'))
        #postvars = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
	postvars = parse_qs(self.rfile.read(length), keep_blank_values=1)
        return postvars

    def do_GET(self):
        self._set_headers()
        self.wfile.write("<html><body><h1>hi!</h1></body></html>")

    def do_HEAD(self):
        self._set_headers()
        
    def do_POST(self):
        # Doesn't do anything with posted data
        self._set_headers()
	self.wfile.write(self.path)
        postvars = self.parse_POST()
	self.wfile.write(postvars)
	#self.wfile.write("<html><body><h1>POST!</h1></body></html>")
        
def run(server_class=HTTPServer, handler_class=S, port=31384):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print 'Starting httpd...'
    httpd.serve_forever()

if __name__ == "__main__":
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()
