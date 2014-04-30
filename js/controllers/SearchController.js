var App = angular.module('App');

/**
 * View controller that manages the behaviour of the header element
 * including the title bar and the search box.
 *
 * @class SearchController
 */
App.controller('SearchController', ['$scope', function ($scope) {
    'use strict';

    var requestAnimationFrame = (function () {
            return window.requestAnimationFrame    ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        }()),

        $document           = $(document),
        $titleBar           = $('#Title'),
        $content            = $('#Content'),
        $header             = $('#Header'),
        $searchContainer    = $('#SearchBoxContainer'),

        originalContentPaddingTop = parseInt($content.css('padding-top'), 10),
        rendering = false,
        isSearchBoxVisible  = true,
        isTitleBarVisible   = true,
        titleHeightInvalidated = false,
        searchBoxHeightInvalidated = false;

    /**
     * Returns with the height of the title bar.
     * The Value returns from cache if it is not invalidated.
     */
    function getTitleBarHeight() {

        if (!getTitleBarHeight.titleBarHeight || titleHeightInvalidated) {
            getTitleBarHeight.titleBarHeight = $titleBar.outerHeight();
        }

        return getTitleBarHeight.titleBarHeight;
    }

    /**
     * Returns with the height of the search box.
     * The Value returns from cache if it is not invalidated.
     */
    function getSearchBoxHeight() {
        if (!getTitleBarHeight.searchBoxHeight || searchBoxHeightInvalidated) {
            getTitleBarHeight.searchBoxHeight = $searchContainer.outerHeight();
        }

        return getTitleBarHeight.searchBoxHeight;
    }

    /**
     * Helper function that is able to calculate
     * the height of the whole header according to
     * the visibility of the title bar and the search box.
     *
     * @return {int}
     */
    function calculateHeaderHeight() {
        var headerHeight = 0;

        if (isSearchBoxVisible) {
            headerHeight += getSearchBoxHeight();
        }

        if (isTitleBarVisible) {
            headerHeight += getTitleBarHeight();
        }

        return headerHeight;
    }

    /**
     * Sets the upper padding of the content according
     * to the current height of the whole header (title bar + search box)
     */
    function setContentPaddingAccordingToHeaderHeight() {
        var headerHeight = calculateHeaderHeight();
        $content.css('padding-top', (originalContentPaddingTop + calculateHeaderHeight()) + 'px');
        $header.css('height', headerHeight + 'px');
    }

    /**
     * Sets the visibility of the title bar according to
     * the given value.
     *
     * @param value {Boolean}
     */
    function setTitleBarVisibility(value) {

        var top = getTitleBarHeight();

        top = value ? 0 : top * (-1);

        $titleBar.css('top', top + 'px');
        isTitleBarVisible = value;
    }

    /**
     * Sets the visibility of the search box according to
     * the given value.
     *
     * @param value {Boolean}
     */
    function setSearchBoxVisibility(value) {

        var top = getSearchBoxHeight(),
            titleHeight = getTitleBarHeight();

        if (isTitleBarVisible) {
            top += titleHeight;
        }

        top = value ? (isTitleBarVisible ? titleHeight : 0) : top * (-1);

        $searchContainer.css('top', top + 'px');

        isSearchBoxVisible = value;
    }

    /**
     * Sets the visibility of the title bar and search box according to
     * the document's scrollTop property.
     * If it's needed, it recalculates the upper padding of the content.
     *
     * @param scrollTop {int}   document's scrollTop property
     */
    function handleVisibilities(scrollTop) {
        var updated = false;

        if (scrollTop > 20) {

            if (isTitleBarVisible) {
                setTitleBarVisibility(false);
                setSearchBoxVisibility(true);
                updated = true;
            }
        } else {
            if (scrollTop <= 20 && !isTitleBarVisible) {
                setTitleBarVisibility(true);

                if (isSearchBoxVisible) {
                    setSearchBoxVisibility(true);
                }

                updated = true;
            }
        }

        if (updated) {
            requestAnimationFrame(setContentPaddingAccordingToHeaderHeight);
        }
    }

    /**
     * Window scroll event listener.
     * Sets the visibility of the title bar and search box according to
     * the document's scrollTop property.
     */
    $(window).scroll(function () {

        if (!rendering) {
            rendering = true;
            requestAnimationFrame(function () {

                var scrollTop = $document.scrollTop();

                handleVisibilities(scrollTop);

                if (scrollTop > 0) {
                    $header.addClass('shadow-on');
                } else {
                    $header.removeClass('shadow-on');
                }

                rendering = false;
            });
        }
    });

    /**
     * Event listener that is invoked when user clicks on the
     * search box opener/closer button.
     * Behaves like a toggle button.
     * Recalculates the upper padding of the content
     */
    $scope.onSearchBoxToggleClick = function () {

        setSearchBoxVisibility(!isSearchBoxVisible);
        requestAnimationFrame(setContentPaddingAccordingToHeaderHeight);
    };

    /**
     * Event listener that is invoked when user clicks on the
     * "close search box" button.
     * Hides the search box and recalculates the upper padding of the content.
     */
    $scope.onCloseSearchBoxBtnClicked = function () {

        setSearchBoxVisibility(false);
        setTitleBarVisibility(true);
        requestAnimationFrame(setContentPaddingAccordingToHeaderHeight);
    };

    /**
     * Event listener that is invoked when tags are added or removed.
     */
    $scope.$on('tagsChange', function () {
        searchBoxHeightInvalidated = true;
        requestAnimationFrame(setContentPaddingAccordingToHeaderHeight);
    });

    /////////////////// initialise

    setTitleBarVisibility(isTitleBarVisible);
    setSearchBoxVisibility(isSearchBoxVisible);
    requestAnimationFrame(setContentPaddingAccordingToHeaderHeight);

}]);