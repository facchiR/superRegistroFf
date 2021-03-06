app.service('SessionService', [ '$http', 'URL', '$sessionStorage', function( $http, URL, $sessionStorage ){
    
    var onError = function(response)
        {console.log("Errore di chiamata: ", response);};

    var onSuccess = function(response)
        {
            var session = angular.toJson(response.data.result.session);
            $sessionStorage.session = session;
        };
        

    var signin = function(request, afterReady){
        var data = request? request.data : {};
        afterReady = afterReady?afterReady:function(){};
        var onReady = function(response){
            onSuccess(response); 
            afterReady();
        };
        $http({
            url : URL.REST + '/signin.json',
            method : "GET",
            data : data,
            dataType : "json"
        }).then(onReady, onError);
    };
    
    var get = function(){
        //se esiste session e non è un array vuoto
        if('session' in $sessionStorage && $sessionStorage.session.length){
            return angular.fromJson($sessionStorage.session);
        }else
            return null;
    };
    
    var isAdmin = function(){
        return get()? (get().role == 'admin'): false;
    };
    
    var signout = function(afterReady){
        $sessionStorage.session = '';
        afterReady();
    };
    
    return {
        signin : signin,
        signout : signout,
        get: get,
        isAdmin : isAdmin
    };
}]);

