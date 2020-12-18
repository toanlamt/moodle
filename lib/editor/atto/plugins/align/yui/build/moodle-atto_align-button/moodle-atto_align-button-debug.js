YUI.add('moodle-atto_align-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_align
 * @copyright  2014 Frédéric Massart
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_align-button
 */

/**
 * Atto text editor align plugin.
 *
 * @namespace M.atto_align
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

Y.namespace('M.atto_align').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    initializer: function() {

        this.addToolbarMenu({
            icon: 'e/align_left',
            group: true,
            items: [
                {
                    'icon': 'e/align_left', 'title': 'leftalign', 'buttonName': 'justifyLeft',
                    'callback': this._changeStyle, 'callbackArgs': 'justifyLeft'
                },
                {
                    'icon': 'e/align_center', 'title': 'center', 'buttonName': 'justifyCenter',
                    'callback': this._changeStyle, 'callbackArgs': 'justifyCenter'
                },
                {
                    'icon': 'e/align_right', 'title': 'rightalign', 'buttonName': 'justifyRight',
                    'callback': this._changeStyle, 'callbackArgs': 'justifyRight'
                },
            ]
        });

        // Highlight button.
        var host = this.get('host');
        host.on('atto:selectionchanged', function(e) {
            Y.soon(Y.bind(function(e) {
                if (host.selectionFilterMatches('*[style^="text-align:"]', e.selectedNodes, false)) {
                    this.highlightButtons();
                } else {
                    this.unHighlightButtons();
                }
            }, this, e));
        }, this);
    },


    /**
     * Change the alignment to the specified justification.
     *
     * @method _changeStyle
     * @param {EventFacade} e
     * @param {string} justification The execCommand for the new justification.
     * @private
     */
    _changeStyle: function(e, justification) {
        var host = this.get('host');

        // We temporarily re-enable CSS styling to try to have the most consistency.
        // Though, IE, as always, is stubborn and will do its own thing...
        host.enableCssStyling();

        document.execCommand(justification, false, null);

        // To clean up IE's mess.
        this.editor.all('*[align]').each(function(node) {
            var align = node.get('align');
            if (align) {
                node.setStyle('text-align', align);
                node.removeAttribute('align');
            }
        }, this);

        // Re-disable the CSS styling after making the change.
        host.disableCssStyling();

        // Mark the text as having been updated.
        this.markUpdated();

        this.editor.focus();
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
