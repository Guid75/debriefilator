/**
* Note.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		text: {
			type: 'string'
		},
		score: {
			type: 'integer',
			defaultsTo: 0
		},
    column: {
      type: 'string'
    },
    retro: {
      model: 'retro',
      required: true
    }
  }
};
