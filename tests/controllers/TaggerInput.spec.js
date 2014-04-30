describe('TaggerInput', function () {

    var tagger,
        $tagger,
        $scope;

    beforeEach(module('App'));

    beforeEach(inject(function ($injector) {
        var $rootScope = $injector.get('$rootScope'),
            $controller = $injector.get('$controller');

        $scope = $rootScope.$new();
        $tagger = $('<div><input type="text" /></div>');
        tagger = $controller('TaggerInput', { '$scope': $scope, '$element': $tagger });
    }));

    it('should add tags properly', function () {

        $tagger.find('input[type=text]:first').val('Tag');

        $scope.onInputFieldKeyUp({keyCode: 13});

        expect($scope.tags.length).toEqual(1);
        expect($scope.tags[0]).toEqual('Tag');
    });

    it('should ignore adding empty string', function () {

        $tagger.find('input[type=text]:first').val('');

        $scope.onInputFieldKeyUp({keyCode: 13});
        expect($scope.tags.length).toEqual(0);
    });

    it('should remove tags properly', function () {

        $tagger.find('input[type=text]:first').val('Tag1');
        $scope.onInputFieldKeyUp({keyCode: 13});

        $tagger.find('input[type=text]:first').val('Tag2');
        $scope.onInputFieldKeyUp({keyCode: 13});

        $tagger.find('input[type=text]:first').val('Tag3');
        $scope.onInputFieldKeyUp({keyCode: 13});

        expect($scope.tags.length).toEqual(3);

        $scope.onRemoveClick({
            target: $('<div data-value="Tag2" />'),
            preventDefault: function () {}
        });

        expect($scope.tags.length).toEqual(2);
        expect($scope.tags).toEqual(['Tag1', 'Tag3']);
    });

});