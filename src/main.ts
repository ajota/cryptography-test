import { encryptDataWithPublicKey } from './crypto';
import { encode } from 'uint8-to-base64';

interface DataToShow { encShow?:string, resShow?:string }

const inputData: HTMLInputElement = document.querySelector('#data');

inputData.addEventListener( 'keypress', ( ev: KeyboardEvent ) => {
    const elem: HTMLInputElement = ev.target as HTMLInputElement;
    
    if ( ev.key.toLowerCase() === 'enter' && elem.value ){
        encrypt( elem.value, showEncription );
    }

} );

function showEncription ( data: DataToShow  ) {

    const inputShowEnc: HTMLInputElement = document.querySelector('#encription');
    const divToShowData: HTMLDivElement = document.querySelector('#decripted-data');
    
    inputShowEnc.value = data.encShow;
    divToShowData.innerHTML = data.resShow;
}

function encrypt ( dataToEncrypt, callback ) {
    
    const dataToSend:DataToShow = {};

    encryptDataWithPublicKey( dataToEncrypt )
        .then( ( data ) => {
        
            const dataBase64 = encode( data );
            dataToSend.encShow = dataBase64;

            fetch(
                'https://criptopruebas.azurewebsites.net/WeatherForecast', 
                { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        input: dataBase64
                    })
                } )
                .then( async ( res ) => {
                    const response = await res.text();
                    dataToSend.resShow = `<code>${response}</code>`;

                    callback( dataToSend );
                    console.log( 'Decripted:', response )
                } )
        });
}

