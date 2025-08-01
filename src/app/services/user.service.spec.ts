import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User, RegisterData } from '../shared/models/user.model';
import { environment } from '../../environments/environment';

describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;
    const apiUrl = `${environment.apiUrl}/api/users`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserService]
        });
        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('createUser', () => {
        it('should create a new user and return the user object', () => {
            const newUser: Omit<User, 'id'> = {
                username: 'testuser',
                name: 'Test User',
                email: 'test@example.com',
                role: 'user',
                status: 'active'
            };
            const expectedUser: User = { id: '1', ...newUser };

            service.createUser(newUser).subscribe(user => {
                expect(user).toEqual(expectedUser);
            });

            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('POST');
            req.flush(expectedUser);
        });
    });

    describe('updateUser', () => {
        it('should update an existing user and return the updated user object', () => {
            const updatedUser: User = {
                id: '1',
                username: 'testuser',
                name: 'Test User Updated',
                email: 'test@example.com',
                role: 'user',
                status: 'active'
            };

            service.updateUser(updatedUser).subscribe(user => {
                expect(user).toEqual(updatedUser);
            });

            const req = httpMock.expectOne(`${apiUrl}/${updatedUser.id}`);
            expect(req.request.method).toBe('PUT');
            req.flush(updatedUser);
        });
    });
});
