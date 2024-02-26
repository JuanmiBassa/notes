package com.example.notes.user;

import javax.validation.constraints.NotNull;

public class PasswordChange {
    @NotNull
    String oldPassword;

    @NotNull
    String newPassword;

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
