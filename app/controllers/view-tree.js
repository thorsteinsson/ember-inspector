import { get } from '@ember/object';
import Controller, { inject as controller } from '@ember/controller';
import searchMatch from 'ember-inspector/utils/search-match';
import { filter } from '@ember/object/computed';

export default Controller.extend({
  application: controller(),
  pinnedObjectId: null,
  inspectingViews: false,

  /**
   * Bound to the search field to filter the component list.
   *
   * @property searchText
   * @type {String}
   * @default ''
   */
  searchText: '',

  /**
   * The filtered view list.
   *
   * @property filteredList
   * @type {Array<Object>}
   */
  filteredList: filter('model', function(item) {
    return searchMatch(get(item, 'value.name'), this.get('searchText'));
  }).property('model.[]', 'searchText'),

  actions: {
    previewLayer({ value: { objectId, elementId, renderNodeId } }) {
      // We are passing all of objectId, elementId, and renderNodeId to support post-glimmer 1, post-glimmer 2, and root for
      // post-glimmer 2
      this.get('port').send('view:previewLayer', { objectId, renderNodeId, elementId });
    },

    hidePreview() {
      this.get('port').send('view:hidePreview');
    },

    toggleViewInspection() {
      this.get('port').send('view:inspectViews', { inspect: !this.get('inspectingViews') });
    },

    sendModelToConsole(value) {
      // do not use `sendObjectToConsole` because models don't have to be ember objects
      this.get('port').send('view:sendModelToConsole', value);
    },

    sendObjectToConsole(objectId) {
      this.get('port').send('objectInspector:sendToConsole', { objectId });
    },

    inspect(objectId) {
      if (objectId) {
        this.get('port').send('objectInspector:inspectById', { objectId });
      }
    },

    inspectElement({ objectId, elementId }) {
      this.get('port').send('view:inspectElement', { objectId, elementId });
    }
  }
});
