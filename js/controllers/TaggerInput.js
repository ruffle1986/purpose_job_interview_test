var App = angular.module('App');

/**
 *
 * @class TaggerInput
 *
 * View controller that manages adding or removing tags from
 * the search panel.
 */
App.controller('TaggerInput', ['$scope', '$element', function ($scope, $element) {
    'use strict';

    var DEFAULT_VALUE_SEARCH_INPUT = 'Search for anything porn',
        DEFAULT_VALUE_SEARCH_INPUT_HAS_TAGS = '+ Add new keywords here.',

        tags = $scope.tags = [],

        $inputField = $element.find('input[type=text]:first')
            .val(tags.length ? DEFAULT_VALUE_SEARCH_INPUT_HAS_TAGS : DEFAULT_VALUE_SEARCH_INPUT);

    /**
     * Adds the given tag to the stack.
     *
     * @param tag {String}
     */
    function addTag(tag) {
        if (tags.indexOf(tag) === -1) {
            tags.push(tag);
            $scope.$emit('tagsChange');
        }
    }

    /**
     * Removes the given tag from the stack.
     *
     * @param tag {String}
     */
    function removeTag(tag) {
        var index;
        if ((index = tags.indexOf(tag)) !== -1) {
            tags.splice(index, 1);
            $scope.$emit('tagsChange');
        }
    }

    /**
     * The Search box's keyup event listener.
     * If the user presses enter and the value of the input field
     * is truthy, it adds the value as a tag to the stack.
     *
     * @param $event {Object}    event object
     */
    $scope.onInputFieldKeyUp = function ($event) {
        var keyCode = $event.keyCode || $event.which,
            val = $.trim($inputField.val());

        if (keyCode === 13 && val) {
            addTag(val);
            $inputField.val('');
        }
    };

    /**
     * Click listener of the tag's remove button.
     * Removes the tag from the stack on which the event occurred.
     *
     * @param $event {Object}   event object
     */
    $scope.onRemoveClick = function($event) {
        var tag = $($event.target).data('value');
        removeTag(tag);
        $event.preventDefault();
    };

    /**
     * Search box's focus listener.
     * Removes the value of the input field and sets focused state.
     *
     */
    $scope.onSearchInputFocus = function () {
        $inputField
            .val('')
            .addClass('state-focused');
    };

    /**
     * Search box's blur listener.
     * Sets the default value of the input field, if the field is empty
     * and unsets the focused state.
     */
    $scope.onSearchInputBlur = function () {

        var currentVal = $.trim($inputField.val());

        if (!currentVal) {
            $inputField
                .val(tags.length ? DEFAULT_VALUE_SEARCH_INPUT_HAS_TAGS : DEFAULT_VALUE_SEARCH_INPUT);
        }

        $inputField.removeClass('state-focused');
    };

    /**
     * Changes the class name and the default value of the input field
     * according to the number of the tags.
     */
    $scope.$on('tagsChange', function () {

        if (tags.length > 0) {
            $inputField
                .addClass('has-tags');
        } else {
            $inputField
                .removeClass('has-tags')
                .val(DEFAULT_VALUE_SEARCH_INPUT);
        }
    });
}]);