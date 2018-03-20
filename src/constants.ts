import { enumToMap, IEnumMap } from './utils';

export type HTTPMode = 'loose' | 'strict';

// C headers

export enum ERROR {
  OK = 0,
  INTERNAL,
  STRICT,
  LF_EXPECTED,
  UNEXPECTED_CONTENT_LENGTH,
  CLOSED_CONNECTION,
  INVALID_METHOD,
  INVALID_URL,
  INVALID_CONSTANT,
  INVALID_VERSION,
  INVALID_HEADER_TOKEN,
  INVALID_CONTENT_LENGTH,
  INVALID_CHUNK_SIZE,
  INVALID_STATUS,

  CB_HEADERS_COMPLETE,
  CB_MESSAGE_COMPLETE,
  CB_CHUNK_HEADER,
  CB_CHUNK_COMPLETE,

  PAUSED,
}

export enum TYPE {
  BOTH = 0,  // default
  REQUEST,
  RESPONSE,
}

export enum FLAGS {
  CONNECTION_KEEP_ALIVE = 1 << 0,
  CONNECTION_CLOSE = 1 << 1,
  CONNECTION_UPGRADE = 1 << 2,
  CHUNKED = 1 << 3,
  UPGRADE = 1 << 4,
  CONTENT_LENGTH = 1 << 5,
  SKIPBODY = 1 << 6,
  TRAILING = 1 << 7,
}

export enum METHODS {
  DELETE = 0,
  GET = 1,
  HEAD = 2,
  POST = 3,
  PUT = 4,
  /* pathological */
  CONNECT = 5,
  OPTIONS = 6,
  TRACE = 7,
  /* WebDAV */
  COPY = 8,
  LOCK = 9,
  MKCOL = 10,
  MOVE = 11,
  PROPFIND = 12,
  PROPPATCH = 13,
  SEARCH = 14,
  UNLOCK = 15,
  BIND = 16,
  REBIND = 17,
  UNBIND = 18,
  ACL = 19,
  /* subversion */
  REPORT = 20,
  MKACTIVITY = 21,
  CHECKOUT = 22,
  MERGE = 23,
  /* upnp */
  MSEARCH = 24,
  NOTIFY = 25,
  SUBSCRIBE = 26,
  UNSUBSCRIBE = 27,
  /* RFC-5789 */
  PATCH = 28,
  PURGE = 29,
  /* CalDAV */
  MKCALENDAR = 30,
  /* RFC-2068, section 19.6.1.2 */
  LINK = 31,
  UNLINK = 32,
  /* icecast */
  SOURCE = 33,
}

export const METHOD_MAP = enumToMap(METHODS);

// Internal

export type CharList = Array<string | number>;

export const ALPHA: CharList = [];

for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
  // Upper case
  ALPHA.push(String.fromCharCode(i));

  // Lower case
  ALPHA.push(String.fromCharCode(i + 0x20));
}

export const NUM_MAP = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4,
  5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
};

export const HEX_MAP = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4,
  5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
  a: 0xa, b: 0xb, c: 0xc, d: 0xd, e: 0xe, f: 0xf,
};

export const NUM: CharList = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
];

export const ALPHANUM: CharList = ALPHA.concat(NUM);
export const MARK: CharList = [ '-', '_', '.', '!', '~', '*', '\'', '(', ')' ];
export const USERINFO_CHARS: CharList = ALPHANUM
  .concat(MARK)
  .concat([ '%', ';', ':', '&', '=', '+', '$', ',' ]);

// TODO(indutny): use RFC
export const STRICT_URL_CHAR: CharList = ([
  '!', '"', '$', '%', '&', '\'',
  '(', ')', '*', '+', ',', '-', '.', '/',
  ':', ';', '<', '=', '>',
  '@', '[', '\\', ']', '^', '_',
  '`',
  '{', '}', '~',
] as CharList).concat(ALPHANUM);

export const URL_CHAR: CharList = STRICT_URL_CHAR
  .concat(([ '\t', '\f' ] as CharList)
    .concat(STRICT_URL_CHAR)
    .map((c: string | number) => {
      if (typeof c === 'string') {
        return c.charCodeAt(0) | 0x80;
      } else {
        return c | 0x80;
      }
    }));

export const HEX: CharList = NUM.concat(
  [ 'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F' ]);

/* Tokens as defined by rfc 2616. Also lowercases them.
 *        token       = 1*<any CHAR except CTLs or separators>
 *     separators     = "(" | ")" | "<" | ">" | "@"
 *                    | "," | ";" | ":" | "\" | <">
 *                    | "/" | "[" | "]" | "?" | "="
 *                    | "{" | "}" | SP | HT
 */
export const STRICT_TOKEN: CharList = ([
  '!', '#', '$', '%', '&', '\'',
  '*', '+', '-', '.',
  '^', '_', '`',
  '|', '~',
] as CharList).concat(ALPHANUM);

export const TOKEN: CharList = STRICT_TOKEN.concat([ ' ' ]);

/*
 * Verify that a char is a valid visible (printable) US-ASCII
 * character or %x80-FF
 */
export const HEADER_CHARS: CharList = [ '\t' ];
for (let i = 32; i < 255; i++) {
  if (i !== 127) {
    HEADER_CHARS.push(i);
  }
}

// ',' = \x44
export const CONNECTION_TOKEN_CHARS: CharList =
  HEADER_CHARS.filter((c) => c !== 44);

export const MAJOR = NUM_MAP;
export const MINOR = MAJOR;

export enum HEADER_STATE {
  GENERAL = 0,
  PROXY_CONNECTION = 1,
  CONNECTION = 2,
  CONTENT_LENGTH = 3,
  TRANSFER_ENCODING = 4,
  UPGRADE = 5,

  CONNECTION_KEEP_ALIVE = 6,
  CONNECTION_CLOSE = 7,
  CONNECTION_UPGRADE = 8,
  TRANSFER_ENCODING_CHUNKED = 9,
}

export const SPECIAL_HEADERS = {
  'connection': HEADER_STATE.CONNECTION,
  'content-length': HEADER_STATE.CONTENT_LENGTH,
  'proxy-connection': HEADER_STATE.PROXY_CONNECTION,
  'transfer-encoding': HEADER_STATE.TRANSFER_ENCODING,
  'upgrade': HEADER_STATE.UPGRADE,
};