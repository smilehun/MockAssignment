import { Injectable } from '@angular/core';
import { AbilityBuilder, createMongoAbility, MongoAbility, RawRuleOf } from '@casl/ability';
import { UserRole } from '../shared/models/user.model';

type Actions = 'manage' | 'read' | 'view';
type Subjects = 'user' | 'admin' | 'UserManager' | 'Login' | 'Register' | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable({ providedIn: 'root' })
export class AbilityService {
    private ability = createMongoAbility<[Actions, Subjects]>([]);

    getAbility(): AppAbility {
        return this.ability;
    }

    /**
     * Updates user abilities based on their role
     * @param role - User role from predefined enum
     */
    updateAbility(role: UserRole): void {
        const rules = this.buildRulesForRole(role);
        this.ability.update(rules);
    }

    private buildRulesForRole(role: UserRole): RawRuleOf<AppAbility>[] {
        const { can, cannot, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

        switch (role) {
            case 'owner':
                this.setOwnerPermissions(can);
                break;
            case 'admin':
                this.setAdminPermissions(can, cannot);
                break;
            case 'user':
                this.setUserPermissions(can, cannot);
                break;
        }

        return rules;
    }

    private setOwnerPermissions(can: AbilityBuilder<AppAbility>['can']): void {
        can('manage', 'all');
    }

    private setAdminPermissions(can: AbilityBuilder<AppAbility>['can'], cannot: AbilityBuilder<AppAbility>['cannot']): void {
        can('read', 'all');
        can('view', 'UserManager');
        cannot('manage', 'admin').because('only owners can manage admins');
        can('manage', 'user');
    }

    private setUserPermissions(can: AbilityBuilder<AppAbility>['can'], cannot: AbilityBuilder<AppAbility>['cannot']): void {
        can('read', 'all');
        can('view', 'UserManager');
        cannot('manage', 'user').because('only admins or owners can manage users');
    }
}
