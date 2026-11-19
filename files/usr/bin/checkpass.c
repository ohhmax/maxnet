/*
 * ==============================================================================
 * MAXNET ENTERPRISE PASSWORD VERIFICATION UTILITY (C REFERENCE SOURCE)
 * Cryptographic Shadow Password Verification
 * Copyright (c) 2026 Mahendra Mali - Max. All Rights Reserved.
 *
 * Compilation:
 *   gcc -O2 -Wall -Wextra checkpass.c -lcrypt -o checkpass
 *   strip --strip-all checkpass
 * ==============================================================================
 */

#define _XOPEN_SOURCE 700
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <shadow.h>
#include <crypt.h>

int main(int argc, char *argv[]) {
    if (argc < 3) {
        fprintf(stderr, "Usage: %s <username> <password>\n", argv[0]);
        return 1;
    }

    const char *username = argv[1];
    const char *password = argv[2];

    if (!username || !password || strlen(password) == 0) {
        return 1;
    }

    /* Retrieve shadow password entry */
    struct spwd *sp = getspnam(username);
    if (!sp || !sp->sp_pwdp) {
        return 1;
    }

    /* Check for disabled or locked account status */
    if (sp->sp_pwdp[0] == '!' || sp->sp_pwdp[0] == '*' || strlen(sp->sp_pwdp) < 2) {
        return 1;
    }

    /* Hash input password using the stored hash's salt/algorithm settings */
    char *encrypted = crypt(password, sp->sp_pwdp);
    if (!encrypted) {
        return 1;
    }

    /* Constant-time comparison or standard string equality */
    if (strcmp(encrypted, sp->sp_pwdp) == 0) {
        return 0; /* Password matches */
    }

    return 1; /* Invalid credentials */
}
