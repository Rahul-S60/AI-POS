'use client'

import { deleteUserAccount } from '@/app/actions/profile'

export default function DeleteAccountButton() {
  return (
    <form action={deleteUserAccount}>
      <button 
        type="submit"
        className="shrink-0 bg-red-500/20 hover:bg-red-500 hover:text-white text-red-500 font-semibold px-6 py-2.5 rounded-lg transition-all border border-red-500/30"
        onClick={(e) => {
          if (!confirm('Are you absolutely sure you want to delete your account? All your data will be permanently erased. This cannot be undone.')) {
            e.preventDefault()
          }
        }}
      >
        Delete Account
      </button>
    </form>
  )
}
