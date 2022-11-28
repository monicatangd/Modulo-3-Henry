'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor){
    if(typeof executor !== "function")
        throw new TypeError("executor must be a function");
    
    this._state="pending";
    this._handlerGroups =[];

    executor(
        value=>this._internalResolve(value),
        reason=> this._internalReject(reason)
    );
}
$Promise.prototype._internalResolve=function(value){
    if(this._state === "pendin"){
        this._state="fulfilled";
        this._value=value;
        this._callHandlers();
    }
};
$Promise.prototype._internalReject=function(reason){
    if(this._state==="pending"){
        this._state="rejected";
        this._value= reason;
        this._callHandlers();
    }
};
$Promise.prototype._callHandlers=function(){
    while(this._handlerGroups.length){
        const {successCb, errorCb, downstreamPromise}=
            this._handlerGroups.shift();
        try{
            let handlerReturnValue;
            if(this._state==="fulfilled"){
                if(successCb) handlerReturnValue=successCb(this._value);
                else downstreamPromise._internalResolve(this._value);
            }else{
                if(errorCb) handlerReturnValue=errorCb(this._value);
                else downstreamPromise._internalReject(this._value);
            }
            handlerReturnValue instanceof $Promise
                ? handlerReturnValue.then(
                    value => downstreamPromise._internalResolve(value),
                    reason => downstreamPromise._internalReject(reason)
                )
                : downstreamPromise._internalResolve(handlerReturnValue);
        }catch (error){
            downstreamPromise._internalReject(error);
        }
    }
}
$Promise.prototype.then=function(successHandler, errorHandler){
    const downstreamPromise= new $Promise(()=>{});
    this._handlerGroups.push({
        successCb: typeof successHandler === "function" && successHandler,
        errorCb: typeof errorHandler === "function" && errorHandler,
        downstreamPromise,
    });
    if(this._state!=="pending")this._callHandlers();
    return downstreamPromise;

};
$Promise.prototype.catch=function(errorHandler){
    return this.then(null, errorHandler);
};


module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
