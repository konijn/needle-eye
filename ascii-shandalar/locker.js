/**
 * Locker, throwing back to the days of Hibernate
 * Game data scaffolding must be done here, in 'package'
 */

var locker =
{
    save: function lockerSave() {
        data.timeStamp = Date.now();
        localStorage.setItem('data', JSON.stringify(data));
    },

    load: function lockerLoad()
    {
        data = locker.package(JSON.parse(localStorage.getItem('data')));
    },

    addGame: function lockerAddGame() {
        data = locker.package({});
        locker.save();
    },

    package: function lockerPackage() {
        if (data.version !== VERSION) {
            console.log("Upgraded game from version ${data.version} to ${VERSION}");
        }
    },

    isEmpty: function lockerIsEmpty() {
			try {
        return localStorage.getItem('data') === null;
			}catch(e){
				console.log("localStorage is not available!");
				return true;
			}
    }

};
