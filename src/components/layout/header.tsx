import React from 'react'
import Link from'next/link'
import {Heart, Menu, Plus, Search, User} from 'lucide-react'

function Header() {
	return (
		<header className={'sticky top-0 z-50 border-b bg-white'}>
			<div className={'container mx-auto px-4'}>
				<div className={'flex h-16 items-center justify-center'}>
					{/* Logo */}
					<Link href={'/'} className={'flex items-center gap-2'}>
						<div className={'h-8 w-8 rounded-lg bg-blue-600 items-center justify-center'}>
							<Search className={'h-5 w-5 text-white'} />
						</div>
						<span className={'text-xl font-bold'}>
							Immobiliare<span className={'text-blue-600'}>Platform</span>
						</span>
					</Link>

					{/* Nav desktop */}
					<nav className={'hidden md:flex items-center gap-6'}>
						<Link href={'/search'} className={'text-sm font-medium hover:text-blue-600'}>
							Cerca
						</Link>
						<Link href={'/prezzi'} className={'text-sm font-medium hover:text-blue-600'}>
							Prezzi
						</Link>
						<Link href={'/agezie'} className={'text-sm font-medium hover:text-blue-600'} >
							Agenzie
						</Link>
					</nav>

					{/* Actions */}
					<div className={'flex items-center gap-4'}>
						<Link href={'listing/new'} className={'hidden sm:flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'}>
							<Plus className={'h-4 w-4'} />
							Pubblica Annuncio
						</Link>
						<Link href={'favorites'} className={'relative'} >
							<Heart className={'h-5 w-5'}/>
						</Link>

						<Link href={'/login'} className={'flex items-center gap-2'} >
							<User className={'h-5 w-5'} />
							<span className={'hiden sm:inline text-sm font-medium'} >Accedi</span>
						</Link>
						<button className={'md:hidden'}>
							<Menu className={'h-6 w-6'} />
						</button>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
