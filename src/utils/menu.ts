const routes = [
    {
        path: "/",
        name: "/",
        redirect: "/login",
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/login.vue"),
    },
    {
        path: "/home",
        name: "home",
        component: () => import("../layout/index.vue"),
        redirect: "/home/dashboard",
        meta: {
            title: "首页",
            icon: new URL("../assets/home.png", import.meta.url).href,
            activeIcon: new URL("../assets/home.png", import.meta.url).href,
            code: "1"
        },
        children: [
            {
                path: "dashboard",
                name: "home-dashboard",
                component: () => import("../views/home/dashboard.vue"),
                meta: {
                    title: "数据概览",
                    code: "system:index:analysis"
                }
            }
        ],
    },
    {
        path: "/client",
        name: "client",
        component: () => import("../layout/index.vue"),
        redirect: "/client/list",
        meta: {
            title: "客户管理",
            icon: new URL("../assets/client.png", import.meta.url).href,
            activeIcon: new URL("../assets/client.png", import.meta.url).href,
            code: "1"
        },
        children: [
            {
                path: "list",
                name: "client-list",
                component: () => import("../views/client/list.vue"),
                meta: {
                    title: "客户列表",
                    code: "people:people:list"
                }
            }
        ],
    },
    {
        path: "/contract",
        name: "contract",
        component: () => import("../layout/index.vue"),
        redirect: "/contract/list",
        meta: {
            title: "合同管理",
            icon: new URL("../assets/contract.png", import.meta.url).href,
            activeIcon: new URL("../assets/contract.png", import.meta.url).href,
            code: "1"
        },
        children: [
            {
                path: "list",
                name: "contract-list",
                component: () => import("../views/contract/list.vue"),
                meta: {
                    title: "合同列表",
                    code: "contract:contract:list"
                }
            }
        ],
    },
    {
        path: "/finance",
        name: "finance",
        component: () => import("../layout/index.vue"),
        redirect: "/finance/payment",
        meta: {
            title: "财务管理",
            icon: new URL("../assets/finance.png", import.meta.url).href,
            activeIcon: new URL("../assets/finance.png", import.meta.url).href,
            code: "1"
        },
        children: [
            {
                path: "payment",
                name: "finance-payment",
                component: () => import("../views/finance/payment.vue"),
                meta: {
                    title: "付款列表",
                    code: "financial:zf:list"
                }
            },
            {
                path: "receive",
                name: "finance-receive",
                component: () => import("../views/finance/receive.vue"),
                meta: {
                    title: "收款列表",
                    code: "financial:sr:list"
                }
            }
        ]
    },
    {
        path: "/project",
        name: "project",
        component: () => import("../layout/index.vue"),
        redirect: "/project/list",
        meta: {
            title: "项目管理",
            icon: new URL("../assets/project.png", import.meta.url).href,
            activeIcon: new URL("../assets/project.png", import.meta.url).href,
            code: "1"
        },
        children: [
            {
                path: "list",
                name: "project-list",
                component: () => import("../views/project/list.vue"),
                meta: {
                    title: "项目列表",
                    code: "projectItem:project:list"
                }
            }
        ],
    },
    {
        path: "/supplier",
        name: "supplier",
        component: () => import("../layout/index.vue"),
        redirect: "/supplier/list",
        meta: {
            title: "供应商管理",
            icon: new URL("../assets/supplier.png", import.meta.url).href,
            activeIcon: new URL("../assets/supplier.png", import.meta.url).href,
            code: "1"
        },
        children: [
            {
                path: "list",
                name: "supplier-list",
                component: () => import("../views/supplier/list.vue"),
                meta: {
                    title: "供应商列表",
                    code: "supplier:supplier:list"
                }
            }
        ],
    },
    {
        path: "/organize",
        name: "organize",
        component: () => import("../layout/index.vue"),
        redirect: "/organize/station",
        meta: {
            title: "组织管理",
            icon: new URL("../assets/organize.png", import.meta.url).href,
            activeIcon: new URL("../assets/organize.png", import.meta.url).href,
            code: "1"
        },
        children: [
            {
                path: "station",
                name: "station",
                component: () => import("../views/organize/station.vue"),
                meta: {
                    title: "岗位管理",
                    code: "system:post:list"
                }
            },
            {
                path: "department",
                name: "department",
                component: () => import("../views/organize/department.vue"),
                meta: {
                    title: "部门管理",
                    code: "system:dept:list"
                }
            },
            {
                path: "user",
                name: "user",
                component: () => import("../views/organize/user.vue"),
                meta: {
                    title: "用户列表",
                    code: "system:user:list"
                }
            }
        ]
    },
    {
        path: "/permission",
        name: "permission",
        component: () => import("../layout/index.vue"),
        redirect: "/permission/role",
        meta: {
            title: "权限管理",
            icon: new URL("../assets/permission.png", import.meta.url).href,
            activeIcon: new URL("../assets/permission.png", import.meta.url).href,
            code: "1"
        },
        children: [
            {
                path: "role",
                name: "role",
                component: () => import("../views/permission/role.vue"),
                meta: {
                    title: "角色管理",
                    code: "system:role:list"
                }
            }
        ]
    },
    {
        path: "/system",
        name: "system",
        component: () => import("../layout/index.vue"),
        redirect: "/system/menu",
        meta: {
            title: "系统设置",
            icon: new URL("../assets/system.png", import.meta.url).href,
            activeIcon: new URL("../assets/system.png", import.meta.url).href,
            code: "1"
        },
        children: [
            {
                path: "menu",
                name: "menu",
                component: () => import("../views/system/menu.vue"),
                meta: {
                    title: "菜单管理",
                    code: "system:menu:list"
                }
            },
            {
                path: "dictType",
                name: "dictType",
                component: () => import("../views/system/dictType.vue"),
                meta: {
                    title: "字典类型管理",
                    code: "system:dict:list"
                }
            },
            {
                path: "dict",
                name: "dict",
                component: () => import("../views/system/dict.vue"),
                meta: {
                    title: "字典项管理",
                    code: "1",
                    hidden: true
                }
            },
            {
                path: "params",
                name: "params",
                component: () => import("../views/system/params.vue"),
                meta: {
                    title: "参数设置",
                    code: "system:config:list"
                }
            }
        ]
    },
    {
        path: "/monitor",
        name: "monitor",
        component: () => import("../layout/index.vue"),
        redirect: "/monitor/operlog",
        meta: {
            title: "日志管理",
            icon: new URL("../assets/monitor.png", import.meta.url).href,
            activeIcon: new URL("../assets/monitor.png", import.meta.url).href,
            code: "1"
        },
        children: [
            {
                path: "operlog",
                name: "monitor-operlog",
                component: () => import("../views/monitor/operlog.vue"),
                meta: {
                    title: "操作日志",
                    code: "monitor:operlog:list"
                }
            },
            {
                path: "logininfor",
                name: "monitor-logininfor",
                component: () => import("../views/monitor/logininfor.vue"),
                meta: {
                    title: "登录日志",
                    code: "monitor:logininfor:list"
                }
            }
        ]
    },
    {
        path: "/error",
        name: "error",
        component: () => import("../views/error.vue")
    },
    {
        path: "/:catchAll(.*)",
        redirect: "/error"
    }
]
export default routes
