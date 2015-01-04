var notification;

(function () {
    "use strict";

    notification = {
        text: '',
        icon: '',
        audio: 'notification',
        type: 'default',
        style: '',
        timer: 15,
        callback: null,

        defaults: {
            text: '',
            icon: '',
            audio: 'notification',
            type: 'default',
            timer: 15,
            callback: null
        },

        setDefaults: function (text, image, type, timer, audio, callback) {
            this.defaults.text = (text ? text : '');
            this.defaults.icon = (icon ? icon : '');
            this.defaults.type = (type ? type : 'default');
            this.defaults.audio = (audio ? audio : 'notification');
            this.defaults.timer = (!isNaN(parseInt(timer)) ? parseInt(timer) : 15);
            this.defaults.callback = (callback ? callback : null);
        },

        display: function (text, icon, style, type, timer, audio, callback) {
            // [] if another notification is displaying, queue them up
            var nodeList = document.querySelectorAll("#sweet-js-notification .open");
            if (0 < nodeList.length) {
                var self = this;
                setTimeout(function () {
                    self.display(text, icon, style, type, timer, audio, callback);
                }, 100);
                return;
            }

            var self = this;
            self.text = (text ? text : self.defaults.text);
            self.icon = (icon && "undefined" != typeof(icon) ? icon : self.defaults.icon);
            self.type = (type ? type : self.defaults.type);
            self.style = (style == "success" || style == "warning" || style == "error" || style == "info" ? style : 'normal');
            self.audio = (audio ? audio : self.defaults.audio);
            self.timer = (!isNaN(parseInt(timer)) ? parseInt(timer) : self.defaults.timer);
            self.callback = (callback ? callback : self.defaults.callback);

            switch (self.type) {
                case 'slide':
                    self.popDefault('slide-side');
                    break;
                case 'slide-top':
                    self.popDefault('slide-top');
                    break;
                default:
                    self.popDefault('default');
                    break;
            }
        },

        // [] ---------------------------------------------------------------------------
        // [] Notification types
        // [] ---------------------------------------------------------------------------

        popDefault: function (popClass) {
            var self = this;
            var uuid = self.uuid();
            var html = '<div id="' + uuid + '" class="' + popClass + ' holder open ' + self.style + '">';

            if ('' != self.icon) {
                html += '<div class="icon" style="background-image: url(' + self.icon + ');"></div>' +
                '<div class="text-holder has-icon">';
            } else {
                html += '<div class="text-holder">';
            }

            html += self.getCloseHtml(uuid);

            html += '<div class="text">' + self.text + '</div></div>';

            html += '</div>';

            self.addNotification(html);
        },

        // [] ---------------------------------------------------------------------------
        // [] Shared by all notifications
        // [] ---------------------------------------------------------------------------

        addNotification: function (html) {
            var self = this;
            if ((null === document.getElementById('sweet-js-notification'))) {
                document.body.innerHTML += '<div id="sweet-js-notification"></div>';
            }

            var holder = document.getElementById('sweet-js-notification');
            holder.innerHTML += html;

            var notificationObject = holder.lastChild;

            notificationObject.addEventListener("webkitAnimationEnd", function () {
                self.removeClass(notificationObject, "open");
            }, false);
            notificationObject.addEventListener("oAnimationEnd", function () {
                self.removeClass(notificationObject, "open");
            }, false);
            notificationObject.addEventListener("animationend", function () {
                self.removeClass(notificationObject, "open");
            }, false);

            if (0 < self.timer) {
                var timer = self.timer * 1000;
                var notificationId = notificationObject.id;
                setTimeout(function () {
                    self.close(notificationId, true);
                }, timer);
            }
        },

        getCloseHtml: function (id) {
            return '<div class="close" onclick="notification.close(\'' + id + '\');"></div>';
        },

        close: function (id) {
            var notificationObject = document.getElementById(id);

            if (!document.contains(notificationObject)) {
                return;
            }

            notificationObject.className = notificationObject.className + " remove";
            notificationObject.addEventListener("webkitAnimationEnd", function () {
                notificationObject.parentElement.removeChild(notificationObject);
            }, false);
            notificationObject.addEventListener("oAnimationEnd", function () {
                notificationObject.parentElement.removeChild(notificationObject);
            }, false);
            notificationObject.addEventListener("animationend", function () {
                notificationObject.parentElement.removeChild(notificationObject);
            }, false);
        },

        // [] the following three methods are based on code from this page:
        // [] http://www.openjs.com/scripts/dom/class_manipulation.php

        hasClass: function (obj, clss) {
            return obj.className.match(new RegExp('(\\s|^)' + clss + '(\\s|$)'));
        },

        addClass: function (obj, clss) {
            var self = this;
            if (!self.hasClass(obj, clss)) {
                obj.className += " " + clss;
            }
            function removeClass(ele, cls) {
                if (hasClass(ele, cls)) {
                    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                    ele.className = ele.className.replace(reg, ' ');
                }
            }
        },

        removeClass: function (obj, clss) {
            var self = this;
            if (self.hasClass(obj, clss)) {
                var reg = new RegExp('(\\s|^)' + clss + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        },

        uuid: function () {
            return 'sjn_xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }
})();
