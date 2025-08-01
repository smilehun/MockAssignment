# Tổng quan dự án Angular

## 1. Giới thiệu tổng quan

### Mục tiêu dự án
Dự án này là một ứng dụng quản lý người dùng được xây dựng với Angular, cung cấp các chức năng xác thực (đăng nhập, đăng ký), quản lý người dùng và quản lý admin. Mục tiêu chính là cung cấp một nền tảng an toàn và hiệu quả để quản lý các vai trò và trạng thái người dùng khác nhau trong hệ thống.

### Những chức năng chính
*   **Xác thực người dùng:** Đăng ký tài khoản mới, đăng nhập và đăng xuất.
*   **Quản lý người dùng:** Xem, thêm, sửa, xóa người dùng (dành cho Admin và Owner).
*   **Quản lý Admin:** Xem, thêm, sửa, xóa tài khoản admin (chỉ dành cho Owner).
*   **Quản lý hồ sơ cá nhân:** Người dùng có thể xem và cập nhật thông tin cá nhân của mình.
*   **Phân quyền:** Hệ thống phân quyền dựa trên vai trò (Owner, Admin, User) để kiểm soát quyền truy cập vào các chức năng và dữ liệu.

### Công nghệ đã dùng
*   **Angular:** Phiên bản `^19.0.0` (kiểm tra từ `package.json`).
*   **Ngôn ngữ:** TypeScript.
*   **Thư viện UI:** PrimeNG (`^19.0.8`) cho các thành phần UI phong phú (Button, InputText, Password, Table, Dialog, Toast, v.v.).
*   **CSS Framework:** Tailwind CSS (`^3.4.17`) kết hợp với `tailwindcss-primeui` để tạo kiểu nhanh chóng và responsive.
*   **Quản lý quyền:** `@casl/ability` (`^6.7.3`) và `@casl/angular` (`^9.0.3`) để định nghĩa và kiểm soát quyền truy cập dựa trên vai trò.
*   **HTTP Client:** `@angular/common/http` với RxJS (`~7.8.0`) để xử lý các yêu cầu HTTP không đồng bộ.
*   **Routing:** `@angular/router` (`^19.0.0`) cho quản lý điều hướng và lazy loading.
*   **Form Handling:** Cả Reactive Forms và Template-driven Forms đều được sử dụng.
*   **Backend Mocking:** `json-server` (`^0.17.4`) để tạo API giả lập cho mục đích phát triển.
*   **Công cụ phát triển:** ESLint (`^9.14.0`), Prettier (`^3.0.0`), Webpack Bundle Analyzer (`^4.10.1`).

## 2. Kiến trúc hệ thống

### Mô hình thư mục
Dự án tuân theo mô hình kiến trúc module hóa, với các thư mục chính:
*   `src/app/guards/`: Chứa các Angular Guards để bảo vệ các route.
*   `src/app/interceptors/`: Chứa các HTTP Interceptors để xử lý các yêu cầu và phản hồi HTTP (ví dụ: thêm token xác thực, xử lý lỗi, hiển thị loading spinner).
*   `src/app/layout/`: Chứa các thành phần layout chung của ứng dụng (ví dụ: sidebar, topbar, footer).
*   `src/app/pages/`: Chứa các module/component chính của ứng dụng, được chia theo tính năng (auth, dashboard, managers, profile).
*   `src/app/services/`: Chứa các service cung cấp logic nghiệp vụ và tương tác với API (ví dụ: `AuthService`, `UserService`, `AbilityService`, `LoadingService`).
*   `src/app/shared/`: Chứa các thành phần, model, hằng số và service dùng chung có thể tái sử dụng trên toàn ứng dụng (ví dụ: `shared/components`, `shared/models`, `shared/constants`, `shared/services`).

### Lazy Load + Route Module
Ứng dụng sử dụng lazy loading cho các module tính năng để tối ưu hóa hiệu suất tải ban đầu.
*   `src/app.routes.ts`: Định nghĩa các route cấp cao nhất, bao gồm lazy loading cho module `auth` và `pages`.
    *   `path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes').then((m) => m.default)`
    *   `path: 'pages', loadChildren: () => import('./app/pages/pages.routes').then((m) => m.default)`
*   `src/app/pages/pages.routes.ts`: Định nghĩa các route con cho các trang chính của ứng dụng (profile, users-manager, admin-manager), cũng sử dụng lazy loading cho từng component.
*   `src/app/pages/auth/auth.routes.ts`: Định nghĩa các route cho các trang xác thực (login, register).

### Cách chia service/component/pipe/directive
*   **Components:** Được chia theo tính năng và đặt trong các thư mục tương ứng dưới `src/app/pages/` hoặc `src/app/shared/components/` cho các thành phần dùng chung.
*   **Services:** Được đặt trong `src/app/services/` cho các service cấp ứng dụng (ví dụ: `AuthService`, `UserService`) và `src/app/shared/services/` cho các service tiện ích dùng chung (`UtilsService`). Các service thường được cung cấp ở `root` để có thể sử dụng trên toàn ứng dụng.
*   **Pipes/Directives:** Mặc dù không có ví dụ rõ ràng về custom pipes/directives trong các file đã đọc, theo cấu trúc thông thường của Angular, chúng sẽ được đặt trong thư mục `shared/pipes` hoặc `shared/directives` nếu có.

## 3. Tối ưu hóa đã áp dụng

*   **Change Detection Strategy (OnPush):** `UsersManagerComponent` và `AdminManagerComponent` sử dụng `ChangeDetectionStrategy.OnPush`. Điều này giúp tối ưu hóa hiệu suất bằng cách chỉ chạy cơ chế phát hiện thay đổi khi input của component thay đổi hoặc khi có sự kiện được kích hoạt trong component đó.
*   **Lazy Loading:** Như đã đề cập ở phần kiến trúc, lazy loading được áp dụng cho các module route để giảm kích thước bundle ban đầu và cải thiện thời gian tải ứng dụng.
*   **HTTP Interceptors:**
    *   `loadingInterceptor`: Quản lý trạng thái loading toàn cục của ứng dụng, hiển thị spinner khi có yêu cầu HTTP đang diễn ra và ẩn đi khi tất cả các yêu cầu hoàn tất. Điều này cải thiện trải nghiệm người dùng bằng cách cung cấp phản hồi trực quan.
    *   `errorInterceptor`: Xử lý lỗi HTTP tập trung, hiển thị thông báo lỗi thân thiện với người dùng và tự động đăng xuất/chuyển hướng khi gặp lỗi 401 (Unauthorized).
    *   `authInterceptor`: Tự động thêm token xác thực vào header của mỗi yêu cầu HTTP, giúp đơn giản hóa việc quản lý xác thực.
*   **Local Cache (AuthService):** `AuthService` sử dụng `localStorage` để lưu trữ token xác thực và thông tin người dùng hiện tại, giúp duy trì trạng thái đăng nhập giữa các phiên làm việc. `BehaviorSubject` được sử dụng để quản lý trạng thái người dùng và token, cho phép các component khác đăng ký nhận thông báo khi trạng thái này thay đổi.
*   **Debounce (Implicit):** Mặc dù không thấy `debounceTime` được sử dụng trực tiếp trong các file đã đọc, `APP_CONSTANTS.DEFAULTS.DEBOUNCE_TIME` cho thấy ý định sử dụng debounce cho các tác vụ như tìm kiếm hoặc nhập liệu để tối ưu hóa hiệu suất.

## 4. Khả năng mở rộng

*   **Code dễ thêm tính năng:** Kiến trúc module hóa và phân chia rõ ràng các concerns (layout, auth, managers, shared) giúp dễ dàng thêm các tính năng mới mà không ảnh hưởng lớn đến các phần khác của ứng dụng. Mỗi tính năng có thể được phát triển trong module riêng của nó.
*   **Feature module độc lập:** Việc sử dụng lazy loading và tách các route thành các file riêng biệt (`pages.routes.ts`, `auth.routes.ts`) cho phép các tính năng hoạt động tương đối độc lập, dễ dàng bảo trì và mở rộng.
*   **Reusable directive/service:**
    *   `UtilsService`: Cung cấp các hàm tiện ích chung (quản lý localStorage, validate email/password, format date, get initials) có thể tái sử dụng trên toàn ứng dụng.
    *   `shared/components`: Các component như `LoadingSpinnerComponent` và `LogoComponent` được thiết kế để dùng chung, giảm thiểu việc lặp lại code.
    *   `AbilityService`: Cung cấp một cơ chế phân quyền tập trung và có thể mở rộng, cho phép định nghĩa các quyền mới và áp dụng chúng một cách linh hoạt.

## 5. Bảo mật

*   **Route Guard (`authGuard`):** Bảo vệ các route, đảm bảo rằng chỉ những người dùng đã đăng nhập mới có thể truy cập vào các trang nhất định. Nếu người dùng chưa đăng nhập, họ sẽ được chuyển hướng đến trang đăng nhập.
*   **HTTP Interceptors:**
    *   `AuthInterceptor`: Tự động thêm `Authorization` header với Bearer token vào mỗi yêu cầu HTTP đi, đảm bảo rằng các yêu cầu đến API được xác thực.
    *   `ErrorInterceptor`: Xử lý các lỗi HTTP từ server, đặc biệt là lỗi 401 (Unauthorized), tự động đăng xuất người dùng và chuyển hướng về trang đăng nhập, giúp duy trì trạng thái bảo mật.
*   **Phân quyền (`AbilityService`):** Sử dụng thư viện `@casl/ability` để triển khai phân quyền dựa trên vai trò (Owner, Admin, User). Các quyền được định nghĩa rõ ràng (ví dụ: Owner có thể `manage` `all`, Admin có thể `manage` `user` nhưng không thể `manage` `admin`). Điều này đảm bảo rằng người dùng chỉ có thể thực hiện các hành động mà họ được phép.
*   **Quản lý token, session:** `AuthService` quản lý token xác thực và thông tin người dùng bằng cách lưu trữ chúng trong `localStorage` và sử dụng `BehaviorSubject` để theo dõi trạng thái đăng nhập. Token được gửi đi với mỗi yêu cầu API thông qua `AuthInterceptor`.
*   **Chống XSS, CSRF:** Angular có các cơ chế bảo mật tích hợp để chống lại các lỗ hổng phổ biến như XSS (Cross-Site Scripting) thông qua việc tự động sanitize HTML và CSRF (Cross-Site Request Forgery) thông qua việc sử dụng các token bảo mật (mặc dù không thấy cấu hình CSRF token rõ ràng trong các file đã đọc, Angular thường tích hợp sẵn hoặc dễ dàng cấu hình với backend).

## 6. Sử dụng AI xây dựng

*   **Prompt phần nào:** Tôi, một mô hình AI, đã được sử dụng để hỗ trợ trong các phần sau của dự án:
    *   **Chuyển đổi Style:** Di chuyển các inline styles và Tailwind CSS classes từ file HTML (`register.component.html`) sang file SCSS (`register.component.scss`) tương ứng, giúp code sạch hơn và dễ bảo trì hơn.
    *   **Tạo tài liệu tổng quan:** Tổng hợp thông tin từ nhiều file và thư mục khác nhau trong dự án để tạo ra tài liệu `overview.md` này, bao gồm phân tích kiến trúc, công nghệ, tối ưu hóa và bảo mật.
*   **UX thông minh hơn nhờ AI ra sao:**
    *   **Gợi ý thông minh:** AI có thể phân tích hành vi người dùng để đưa ra gợi ý cá nhân hóa (ví dụ: gợi ý vai trò phù hợp khi tạo người dùng mới dựa trên các vai trò phổ biến).
    *   **Tự động điền/kiểm tra form:** AI có thể cải thiện trải nghiệm nhập liệu bằng cách tự động điền thông tin hoặc kiểm tra tính hợp lệ của dữ liệu theo thời gian thực một cách thông minh hơn.
    *   **Hỗ trợ tìm kiếm nâng cao:** Sử dụng AI để cung cấp kết quả tìm kiếm chính xác và liên quan hơn trong các bảng quản lý người dùng/admin.
    *   **Phân tích và cảnh báo bất thường:** AI có thể giám sát các hoạt động của người dùng và hệ thống để phát hiện các hành vi bất thường hoặc các vấn đề bảo mật tiềm ẩn, từ đó đưa ra cảnh báo kịp thời.

## 7. Demo sản phẩm

Để demo sản phẩm, tôi sẽ trình bày một luồng chính trong chức năng quản lý người dùng hoặc quản lý admin.

**Luồng chính (Ví dụ: Quản lý người dùng - UsersManagerComponent):**
1.  **Đăng nhập:** Người dùng đăng nhập với vai trò `admin` hoặc `owner` để có quyền truy cập vào trang quản lý người dùng.
2.  **Xem danh sách người dùng:** Sau khi đăng nhập, người dùng sẽ được chuyển hướng đến trang dashboard, từ đó có thể điều hướng đến trang "Users Manager". Tại đây, một bảng (PrimeNG Table) sẽ hiển thị danh sách các người dùng hiện có.
3.  **Thêm người dùng mới:**
    *   Nhấn nút "New" để mở dialog thêm người dùng.
    *   Điền thông tin (Tên, Username, Email, Password, Role, Status).
    *   Nhấn "Save". Hệ thống sẽ gọi `userService.createUser()` để thêm người dùng mới.
4.  **Sửa thông tin người dùng:**
    *   Chọn một người dùng từ bảng và nhấn nút "Edit".
    *   Dialog sẽ hiển thị thông tin của người dùng đó.
    *   Thay đổi thông tin (ví dụ: Role, Status) và nhấn "Save". Hệ thống sẽ gọi `userService.updateUser()` để cập nhật.
5.  **Xóa người dùng:**
    *   Chọn một hoặc nhiều người dùng từ bảng và nhấn nút "Delete Selected" hoặc nhấn nút "Delete" trên từng dòng.
    *   Xác nhận hành động xóa. Hệ thống sẽ gọi `userService.deleteUser()` để xóa người dùng.
6.  **Xử lý đặc biệt:**
    *   **Phân quyền:** Các nút "Add", "Edit", "Delete" sẽ bị vô hiệu hóa hoặc ẩn đi nếu người dùng hiện tại không có quyền (`canManageUsers` được kiểm tra bởi `AbilityService`). Ví dụ, một `User` không thể quản lý người dùng khác, một `Admin` không thể quản lý `Admin` khác hoặc `Owner`.
    *   **Thông báo:** Các thông báo (Toast) sẽ xuất hiện để xác nhận thành công hoặc hiển thị lỗi (ví dụ: lỗi xác thực, lỗi phân quyền) thông qua `MessageService` và `ErrorInterceptor`.
    *   **Loading Spinner:** `LoadingSpinnerComponent` sẽ tự động hiển thị trong quá trình gửi yêu cầu API và biến mất khi nhận được phản hồi, nhờ vào `LoadingInterceptor`.

**Highlight phần kỹ thuật nổi bật:**
*   **Kiến trúc module hóa và Lazy Loading:** Giúp ứng dụng có cấu trúc rõ ràng, dễ bảo trì và tối ưu hiệu suất tải.
*   **Hệ thống phân quyền mạnh mẽ với CASL:** Cho phép định nghĩa các quyền phức tạp dựa trên vai trò và kiểm soát chặt chẽ các hành động của người dùng.
*   **HTTP Interceptors toàn diện:** Xử lý tập trung các vấn đề về xác thực, lỗi và trạng thái loading, giảm thiểu code lặp lại trong các service và component.
*   **Sử dụng Reactive Forms và Template-driven Forms:** Thể hiện sự linh hoạt trong việc lựa chọn loại form phù hợp với từng trường hợp sử dụng.
*   **ChangeDetectionStrategy.OnPush:** Tối ưu hóa hiệu suất render của component bằng cách giảm số lần chạy cơ chế phát hiện thay đổi.
