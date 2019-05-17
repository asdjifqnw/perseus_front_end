import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import store from '../store/index'
import { Message } from 'element-ui';

Vue.use(Router)

const router = new Router({

  saveScrollPosition: true,
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: '',
      component: Main,
      children: [  //这里是二级路由的配置
        {
          path: '',
          name: 'recommend',
          component: () => import('@/components/childrenComponents/recommend.vue')
        },
        {
          path: '/subscription',
          name: 'subscription',
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          },
          component: () => import('@/components/childrenComponents/subscription.vue')
        },
        {
          path: '/topSearch',
          name: 'topSearch',
          component: () => import('@/components/childrenComponents/topSearch.vue')
        },
        {
          path: '/newArticle',
          name: 'newArticle',
          meta: {
            requireAuth: true,
          },
          component: () => import('@/components/childrenComponents/newArticle.vue')
        },
        {
          path: '/privateLetter',
          name: 'privateLetter',
          meta: {
            requireAuth: true,
          },
          component: () => import('@/components/childrenComponents/privateLetter.vue')
        },
        {
          path: '/comment',
          name: 'comment',
          meta: {
            requireAuth: true,
          },
          component: () => import('@/components/childrenComponents/comment.vue')
        },
        {
          path: '/drafts',
          name: 'drafts',
          meta: {
            requireAuth: true,
          },
          component: () => import('@/components/childrenComponents/drafts.vue')
        },
        {
          path: '/modifyUserInfo',
          name: 'modifyUserInfo',
          meta: {
            requireAuth: true,
          },
          component: () => import('@/components/childrenComponents/modifyUserInfo.vue')
        },
        {
          path: '/ListMyArticles',
          name: 'ListMyArticles',
          meta: {
            requireAuth: true,
          },
          component: () => import('@/components/childrenComponents/ListMyArticles.vue')
        },{
          path: '/ListMyAttentions',
          name: 'ListMyAttentions',
          meta: {
            requireAuth: true,
          },
          component: () => import('@/components/childrenComponents/Attention.vue')
        },{
          path: '/ListMyCollections',
          name: 'ListMyCollections',
          meta: {
            requireAuth: true,
          },
          component: () => import('@/components/childrenComponents/Collection.vue')
        },{
          path: '/HomePage',
          name: 'HomePage',
          meta: {
            requireAuth: true,
          },
          component: () => import('@/components/childrenComponents/HomePage.vue')
        },
      ]
    }

  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (store.state.token) {  // 通过vuex state获取当前的token是否存在
      next();
    }
    else {
      Message.error('请先登录');
      store.commit("notNewArticle");
      next({
        path: '/',
      })
    }
  }
  else {
    next();
  }
})

export default router;

