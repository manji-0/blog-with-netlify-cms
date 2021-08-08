import { IncomingMessage } from 'http';
import { parse } from 'url';
import { Theme, ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { query } = parse(req.url || '/', true);
    let { fontSize, theme, md, background, filename } = (query || {});

    if (fontSize === undefined) {
        fontSize = "96px"
    }
    if (theme === undefined) {
        theme = "black"
    }
    if (md === undefined) {
        md = "1"
    }
    if (background === undefined) {
        background = ""
    }

    if (filename === undefined) {
        filename = "Hellow World"
    }

    if (Array.isArray(fontSize)) {
        throw new Error('Expected a single fontSize');
    }
    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }
    if (Array.isArray(background)) {
        throw new Error('Expected a single background');
    }
    
    const arr = String(filename).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        theme: ['black', 'white', 'stroke'].includes(theme) ? theme as Theme : "black" as Theme ,
        md: md === '1' || md === 'true',
        fontSize: fontSize,
        background: decodeURIComponent(background)
    };
    return parsedRequest;
}

