const Alexa = require('ask-sdk-core');

const ConvertirGradosHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            (request.intent.name === 'ConversorEspanolIntent' ||
             request.intent.name === 'EnglishConverterIntent');
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const locale = handlerInput.requestEnvelope.request.locale;
        let num = request.intent.slots.num.value;
        let speechOutput = '';

        if (request.intent.name === 'ConversorEspanolIntent') {
            // Convertir de grados Celsius a Fahrenheit
            let fahrenheit = (num * 9/5) + 32;
            speechOutput = `${num} grados centígrados son aproximadamente ${fahrenheit.toFixed(2)} grados Fahrenheit.`;
        } else if (request.intent.name === 'EnglishConverterIntent') {
            // Convertir de grados Fahrenheit a Celsius
            let celsius = (num - 32) * 5/9;
            speechOutput = `${num} degrees Fahrenheit is approximately ${celsius.toFixed(2)} degrees Celsius.`;
        }

        // Seleccionar el mensaje de salida basado en el idioma
        let speakOutput = '';
        if (locale.startsWith('es')) {
            speakOutput = speechOutput; // Mantener respuesta en español
        } else {
            // Traducir respuesta al inglés
            let celsius = (num - 32) * 5/9;
            speakOutput = `${num} degrees Fahrenheit is approximately ${celsius.toFixed(2)} degrees Celsius.`;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const locale = request.locale;
        return request.type === 'LaunchRequest' &&
            (locale === 'es-ES' || locale === 'es-MX');
    },
    handle(handlerInput) {
        const speakOutput = 'Bienvenido, puedes decir Hola o Ayuda. ¿Qué te gustaría probar?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LaunchRequestHandlerEnglish = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const locale = request.locale;
        return request.type === 'LaunchRequest' &&
            (locale === 'en-US' || locale === 'en-GB');
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome, you can say Hello or Help. Which would you like to try?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = '¡Hola Mundo!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Puedes saludarme diciendo hola. ¿Cómo puedo ayudarte?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = '¡Adiós!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Lo siento, no sé nada al respecto. Por favor, inténtalo de nuevo.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Sesión finalizada: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Aquí puede ir cualquier lógica de limpieza necesaria.
        return handlerInput.responseBuilder.getResponse(); // Nota: se envía una respuesta vacía
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Lo siento, tuve problemas para hacer lo que pediste. Por favor, inténtalo de nuevo.';
        console.log(`~~~~ Error manejado: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        ConvertirGradosHandler,
        LaunchRequestHandler,
        LaunchRequestHandlerEnglish,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();

