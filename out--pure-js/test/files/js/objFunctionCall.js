"use strict";
// @ts-nocheck
function someFunc() {
    this.subscription = this.userService.currentUser.subscribe((userData) => {
        this.canModify = userData.username === this.comment.author.username;
    });
}
//# sourceMappingURL=objFunctionCall.js.map