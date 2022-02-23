const key = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2kC9O1jd/BFj0s6x1uLaTOeDbsSRzUF3hs3F6mW74xhSom0TZdH3sOUGeG3esarcuXPt0FYhDdZwcIePFKvwzmSl9eO6rKTymqIm+wV9HN+jruqu1BVbBlBeUFYw+jT+NvYvE7iG55AxfiZsrbQ8Zn84Dr5dDqZWWwBLrZ7fUwlKlfZ8XoRD7suEAcToDukXdLqUCdB6Fr8KFF3PXzq2huKOafGJLt6MyG0n3V/GbtydqpBzinBSA1p17oI4tKfUEnx6w+aA2so6PrB0F79wDv9KfZPN+Jqmc4w/zIOxqsxfaHcIg7KpPHaBBmI5ViuGtmTaUmDqBMKNaZNb177DiQIDAQAB
-----END PUBLIC KEY-----`;

// convierte un string a ArrayBuffer
const str2ArrayBuffer =  (str) => {
    const buffer = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buffer);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buffer;
}

//Convierte un una clave publica en formato PEM a base64
const pemTobase64ArrayBuffer = ( pem ) => {

  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
  
  const binaryDerString = window.atob(pemContents);

  return str2ArrayBuffer(binaryDerString);
}

export const encryptDataWithPublicKey = async (data) => {
    const encoder = new TextEncoder();
    const dataToEncrypt =  encoder.encode(data);

    //obtiene la clave PEM en base64
    const pemArrayBufferKey = pemTobase64ArrayBuffer( key );

    //Transforma la clave en un formato valido para el API de encripcionde JS
    const jsKey = await window.crypto.subtle.importKey(
        "spki", 
        pemArrayBufferKey,
        {
            name: "RSA-OAEP",
            hash: "SHA-1"
        }, 
        true,
        ['encrypt']
    );

    // Encripta los datos necesarios.
    const encription = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        jsKey,
        dataToEncrypt
    );
    
    const encToUint8Array = new Uint8Array( encription );
    
    return encToUint8Array;
}


