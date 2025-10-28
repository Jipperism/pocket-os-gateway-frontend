import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_authed/account/$accountId/settings/plan")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen p-8">
			<div className="mx-auto max-w-4xl">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-100 mb-4">
						Upgrade your plan
					</h1>
					<p className="text-lg text-gray-400">
						Your current plan is Free. Upgrade now to Unlimited.
					</p>
				</div>

				{/* Plan Cards */}
				<div className="grid md:grid-cols-2 gap-8">
					{/* Free Plan Card */}
					<div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
						<div className="text-center">
							<div className="inline-block bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full mb-4">
								FREE
							</div>
							<h2 className="text-3xl font-bold text-gray-100 mb-4">Free</h2>
							<p className="text-gray-400 mb-6">
								Enjoy 1,000,000 free relays a month with Grove on the
								Unstoppable Pocket Network.
							</p>
							<Button
								variant="outline"
								className="w-full mb-8 bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
								disabled
							>
								Current plan
							</Button>
						</div>

						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
									<Check className="w-3 h-3 text-white" />
								</div>
								<span className="text-gray-400">
									1,000,000 relays free per month
								</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
									<Check className="w-3 h-3 text-white" />
								</div>
								<span className="text-gray-400">No throughput limit</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
									<Check className="w-3 h-3 text-white" />
								</div>
								<span className="text-gray-400">Community Discord support</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
									<Check className="w-3 h-3 text-white" />
								</div>
								<span className="text-gray-400">
									Access all supported chains
								</span>
							</div>
						</div>
					</div>

					{/* Unlimited Plan Card */}
					<div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
						<div className="text-center">
							<div className="inline-block bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full mb-4">
								UNLIMITED
							</div>
							<h2 className="text-3xl font-bold text-gray-100 mb-4">
								Unlimited
							</h2>
							<p className="text-gray-400 mb-6">
								Unlimited relays with Grove on the Unstoppable Pocket Network.
							</p>
							<Button className="w-full mb-8 bg-green-600 hover:bg-green-700 text-white">
								Continue with Unlimited
							</Button>
						</div>

						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
									<Check className="w-3 h-3 text-white" />
								</div>
								<span className="text-gray-400">
									Unlimited relays per month
								</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
									<Check className="w-3 h-3 text-white" />
								</div>
								<span className="text-gray-400">
									First 1,000,000 relays per month free
								</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
									<Check className="w-3 h-3 text-white" />
								</div>
								<span className="text-gray-400">No throughput limit</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
									<Check className="w-3 h-3 text-white" />
								</div>
								<span className="text-gray-400">Premium Discord support</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
									<Check className="w-3 h-3 text-white" />
								</div>
								<span className="text-gray-400">
									Access all supported chains
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
