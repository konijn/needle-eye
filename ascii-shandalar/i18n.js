var i18n = {
	setLanguage: function setLanguage(code) {
		i18n.code = code;
	},

	get: function getTranslation(key) {
		return dictionary[key] ? dictionary[key][i18n.code] || key : key;
	},

	code: 'EN'
};

var dictionary = {

	"Something went horribly wrong": {
		FR: "Quelque chose est allé horriblement mal"
	},

	"You should start a game first!": {
		FR: "Vous devriez commencer un jeu en premier!"
	},

	"Hearth of Shandalar": {
		FR: "Hearth de Shandalar"
	}
}
