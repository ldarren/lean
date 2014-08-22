/* Notes:
 * - History management is currently done using window.location.hash.  This could easily be changed to use Push State instead.
 * - jQuery dependency for now. This could also be easily removed.
 */

!function() {

    var
    container = document.getElementById('content'),
    currentPage,
    stateHistory = [],

    // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
    slidePage = function(page, from) {
        if (from) return slidePageFrom(page, from)

        var l = stateHistory.length,
            state = window.location.hash;

        if (l === 0) {
            stateHistory.push(state);
            this.slidePageFrom(page);
            return;
        }
        if (state === stateHistory[l-2]) {
            stateHistory.pop();
            this.slidePageFrom(page, 'left');
        } else {
            stateHistory.push(state);
            this.slidePageFrom(page, 'right');
        }

    },

    // Use this function directly if you want to control the sliding direction outside PageSlider
    slidePageFrom = function(page, from) {
        container.appendChild(page);

        if (!currentPage || !from) {
            page.className = "page center";
            currentPage = page;
            return;
        }

        // Position the page at the starting position of the animation
        page.className = "page " + from;

        currentPage.addEventListener('webkitTransitionEnd', function(e) {
            var child = e.target
            if (!child) return
            child.parentNode.removeChild(child)
        }, false);

        // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        container[0].offsetWidth;

        // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
        page.className = "page transition center"
        currentPage.className = "page transition " + (from === "left" ? "right" : "left")
        currentPage = page;
    }

    container.addEventListener('slide', slidePage, false)

}()
