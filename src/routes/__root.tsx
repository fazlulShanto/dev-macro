import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsInProd } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'

import StoreDevtools from '../lib/demo-store-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsInProd />,
          },
          StoreDevtools,
        ]}
      />
    </>
  ),
})
