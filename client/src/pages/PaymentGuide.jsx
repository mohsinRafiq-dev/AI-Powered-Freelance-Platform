import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowDown,
  ArrowUp,
  Lock,
  CheckCircle,
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  HelpCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const PaymentGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const steps = [
    {
      icon: Wallet,
      title: 'Add Funds to Wallet',
      description: 'Deposit money into your Linkify wallet using JazzCash, Easypaisa, or Bank Transfer',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Lock,
      title: 'Fund Milestone Escrow',
      description: 'Lock funds in escrow when starting a contract milestone',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: CheckCircle,
      title: 'Approve & Release',
      description: 'Client approves completed work and funds are released to freelancer',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: ArrowUp,
      title: 'Withdraw Earnings',
      description: 'Freelancers can withdraw their earnings to JazzCash, Easypaisa, or Bank Account',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const paymentMethods = [
    {
      name: 'JazzCash',
      icon: Smartphone,
      description: 'Mobile wallet payment',
      features: ['Instant deposits', '24/7 availability', 'Secure transactions'],
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    },
    {
      name: 'Easypaisa',
      icon: Smartphone,
      description: 'Mobile wallet payment',
      features: ['Quick transfers', 'Wide acceptance', 'Easy to use'],
      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    },
    {
      name: 'Bank Transfer',
      icon: Building2,
      description: 'Direct bank transfer',
      features: ['Large amounts', 'Secure', 'Manual processing'],
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    },
  ];

  const escrowBenefits = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your funds are held securely until work is completed and approved',
    },
    {
      icon: Clock,
      title: 'No Rush',
      description: 'Take your time to review work before releasing payment',
    },
    {
      icon: Users,
      title: 'Fair for Everyone',
      description: 'Protects both clients and freelancers from payment disputes',
    },
    {
      icon: TrendingUp,
      title: 'Build Trust',
      description: 'Escrow system builds confidence in the platform',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand to-brand-dark rounded-2xl mb-6 shadow-lg">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Payment System Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Learn how to deposit funds, use escrow payments, and withdraw your earnings on Linkify
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['overview', 'deposit', 'escrow', 'withdraw'].map((section) => (
            <Button
              key={section}
              variant={activeSection === section ? 'default' : 'outline'}
              onClick={() => {
                setActiveSection(section);
                document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="capitalize"
            >
              {section}
            </Button>
          ))}
        </div>

        {/* Overview Section */}
        <section id="overview" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow border-2 hover:border-brand">
                      <CardContent className="pt-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center mb-2">
                          <Badge className="mb-3">Step {index + 1}</Badge>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {step.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Deposit Section */}
        <section id="deposit" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 shadow-lg">
                <ArrowDown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                How to Deposit Money
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Add funds to your wallet using secure payment methods
              </p>
            </div>

            <Card className="mb-8 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand" />
                  Quick Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {[
                    'Go to your Wallet page from the profile menu',
                    'Click "Add Funds" or "Deposit" button',
                    'Enter the amount you want to deposit (minimum Rs. 100)',
                    'Select your preferred payment method (JazzCash, Easypaisa, or Bank Transfer)',
                    'Complete the payment through the secure gateway',
                    'Funds will be added to your wallet instantly (or within 24 hours for bank transfers)',
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paymentMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                              {method.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {method.description}
                            </p>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {method.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Escrow Section */}
        <section id="escrow" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                How Escrow Payments Work
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Secure milestone-based payments that protect both clients and freelancers
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="border-2 border-brand">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand" />
                    For Clients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {[
                      'Create a contract with milestones and amounts',
                      'Fund each milestone escrow before work begins',
                      'Funds are locked securely until you approve',
                      'Review completed work and approve when satisfied',
                      'Payment is automatically released to freelancer',
                      'If issues arise, you can raise a dispute for admin review',
                    ].map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300">{step}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card className="border-2 border-brand">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand" />
                    For Freelancers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {[
                      'Accept contract proposals from clients',
                      'Start working on milestones once escrow is funded',
                      'Submit completed work for client review',
                      'Get paid automatically when client approves',
                      'Funds are transferred to your wallet instantly',
                      'Withdraw your earnings to your preferred payment method',
                    ].map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300">{step}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {escrowBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-lg flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {benefit.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Withdrawal Section */}
        <section id="withdraw" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-4 shadow-lg">
                <ArrowUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                How to Withdraw Earnings
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Transfer your earnings from wallet to your bank account or mobile wallet
              </p>
            </div>

            <Card className="mb-8 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-brand" />
                  Withdrawal Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {[
                    'Go to Withdrawals page from your profile menu',
                    'Click "Request Withdrawal" button',
                    'Enter the amount (minimum Rs. 1,000)',
                    'Select withdrawal method (JazzCash, Easypaisa, or Bank Transfer)',
                    'Enter your account details securely',
                    'Submit withdrawal request for admin review',
                    'Admin processes withdrawal (usually within 24-48 hours)',
                    'Receive funds in your account',
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-yellow-200 dark:border-yellow-900/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Processing Time
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Withdrawals are typically processed within 24-48 hours during business days.
                    Bank transfers may take 2-3 business days.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 dark:border-blue-900/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Limits
                      </h3>
                    </div>
                  </div>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Minimum: Rs. 1,000</li>
                    <li>• Maximum: Rs. 100,000 per transaction</li>
                    <li>• Daily limit: Rs. 500,000</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 dark:border-green-900/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Security
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    All account details are encrypted and stored securely. Only admins can view
                    withdrawal requests for processing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-center mb-8">
              <HelpCircle className="w-16 h-16 text-brand mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  q: 'Is my payment information secure?',
                  a: 'Yes, all payment data is encrypted using industry-standard encryption. We never store your full payment credentials.',
                },
                {
                  q: 'What happens if I dispute a payment?',
                  a: 'You can raise a dispute through the contract page. Our admin team will review and resolve the dispute fairly.',
                },
                {
                  q: 'Can I cancel a withdrawal request?',
                  a: 'Yes, you can cancel pending withdrawal requests from the Withdrawals page before they are processed.',
                },
                {
                  q: 'Are there any fees?',
                  a: 'Linkify charges a small platform fee (5%) on completed transactions. There are no fees for deposits or withdrawals.',
                },
                {
                  q: 'How long does escrow hold funds?',
                  a: 'Funds remain in escrow until the client approves the milestone or a dispute is resolved by admin.',
                },
                {
                  q: 'What payment methods are supported?',
                  a: 'We support JazzCash, Easypaisa, and Bank Transfer for both deposits and withdrawals in Pakistan.',
                },
              ].map((faq, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-brand to-brand-dark border-0">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Start using Linkify's secure payment system today. Deposit funds, create contracts,
                and get paid securely.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/wallet">
                  <Button size="lg" variant="secondary" className="flex items-center gap-2">
                    Go to Wallet
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/help">
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentGuide;

