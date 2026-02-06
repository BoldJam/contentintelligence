'use client';
import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Search, Globe, Youtube, FileText, Copy, HardDrive, Link as LinkIcon } from 'lucide-react';
import { useProduct } from '@/lib/productContext';

interface AddSourcesModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSourceCount: number;
    onAddSource: (source: any) => void;
}

export default function AddSourcesModal({ isOpen, onClose, currentSourceCount, onAddSource }: AddSourcesModalProps) {
    const { theme, currentProduct } = useProduct();
    const limit = 30;
    const progressPercentage = Math.min((currentSourceCount / limit) * 100, 100);

    const isFundBuzz = currentProduct === 'fundbuzz';

    const handleMockAdd = (type: 'website' | 'youtube' | 'text') => {
        const id = Math.random().toString(36).substr(2, 9);
        let mockSource: any = {
            id,
            year: 2026,
            badges: [],
            abstract: "Automatically imported source for analysis.",
        };

        const websiteMocks = [
            {
                title: "Global Bond Fund yields reach 10-year high",
                authors: "Bloomberg Finance",
                content: "Global bond markets are experiencing a significant shift as yields on benchmark 10-year government bonds hit levels not seen in over a decade. Analysts attribute this surge to persistent inflationary pressures and a more aggressive stance from central banks worldwide. This environment poses both challenges and opportunities for fixed-income fund managers who must navigate the shifting interest rate landscape while maintaining portfolio stability.\n\nInstitutional investors are increasingly looking towards short-duration bonds to mitigate interest rate risk, while some see the current yields as an attractive entry point for long-term positions. The divergence in fiscal policies between major economies is further complicating the global bond outlook. Fund managers are emphasizing the importance of active management and credit selection in this high-yield environment.\n\nFurthermore, the corporate bond sector is showing signs of stress as borrowing costs rise for businesses already struggling with supply chain disruptions. This has led to a widening of credit spreads in certain sectors, particularly those with higher leverage. Mutual fund investors are advised to closely monitor their bond allocations and understand the underlying risks associated with different duration and credit quality profiles.\n\nLooking ahead, the market remains volatile as investors wait for clearer signals from the Federal Reserve regarding the terminal rate. The potential for a economic slowdown continues to hang over the markets, making the search for yield a delicate balancing act. Diversification across geographies and sectors remains the most cited strategy for resilient bond portfolios in 2026."
            },
            {
                title: "Top 10 ESG Funds to Watch in Q3 2026",
                authors: "Morningstar",
                content: "As we move into the third quarter of 2026, Environmental, Social, and Governance (ESG) investing continues to mature, moving beyond simple exclusion lists to sophisticated impact-driven strategies. Regulatory frameworks across Europe and North America have provided much-needed clarity, leading to better standardization of ESG reporting. This has allowed fund managers to more accurately assess the long-term sustainability and risk profiles of their holdings.\n\nThe top-performing ESG funds this year have demonstrated a keen ability to identify companies that are not only market leaders in their respective fields but are also making measurable progress in reducing their carbon footprints. Integration of climate technology and renewable energy infrastructure has been a key driver of performance within these portfolios. Investors are increasingly demanding tangible evidence of social impact alongside traditional financial returns.\n\nHowever, the sector is not without its controversies, as 'greenwashing' concerns persist despite improved regulations. Diligent fund selection is more critical than ever, with a focus on transparency and third-party verification of ESG metrics. The shift towards 'Active Ownership'—where fund managers engage directly with corporate boards to drive change—is becoming a hallmark of the most successful ESG strategies.\n\nIn the coming months, we expect to see further innovation in the ESG space, particularly in the realm of biodiversity and social equity funds. As institutional capital continues to flow into sustainable investments, the traditional trade-off between values and returns is increasingly being challenged by empirical data showing that well-governed, sustainable companies often outperform their peers over the long run."
            },
            {
                title: "Impact of AI on Mutual Fund management",
                authors: "Financial Times",
                content: "The mutual fund industry is undergoing a digital revolution as Artificial Intelligence (AI) moves from experimental back-office applications to the core of investment decision-making. High-frequency trading and algorithmic model execution are being augmented by large language models that can process vast amounts of unstructured data from news feeds, regulatory filings, and social media in real-time. This capability is giving active managers a new set of tools to identify market inefficiencies and alpha-generating opportunities.\n\nBeyond research, AI is also transforming risk management and portfolio optimization. Predictive analytics are being used to simulate thousands of market scenarios, allowing fund managers to stress-test their portfolios against tail-risk events with unprecedented precision. This technology is particularly effective in identifying correlations between seemingly unrelated asset classes that might emerge during periods of market stress.\n\nCustomer experience is another area where AI is making major inroads. Robo-advisors and AI-driven client portals are providing retail investors with personalized investment advice and portfolio tracking that was previously only available to high-net-worth individuals. This democratization of high-end financial tools is forcing traditional mutual fund firms to accelerate their technology investments to remain competitive in a rapidly changing landscape.\n\nDespite the benefits, the rise of AI in finance brings significant ethical and regulatory challenges. Concerns regarding algorithmic bias and the potential for 'flash crashes' driven by synchronized automated trading are at the forefront of policy discussions. The industry must strike a balance between leveraging the efficiency of AI and maintaining the human oversight necessary to ensure market stability and investor protection."
            },
            {
                title: "Developing Markets: High Growth Fund sectors",
                authors: "Reuters",
                content: "Emerging and developing markets are showing renewed vigor in 2026, led by a surge in infrastructure spending and a growing middle class in regions like Southeast Asia and parts of Africa. Mutual funds focused on these regions are seeing significant inflows as investors seek higher returns outside of the primary developed economies. The digital transformation of these economies, from fintech to e-commerce, is creating a new generation of local champions that are attracting global capital.\n\nOne of the most exciting developments is the rise of 'South-South' trade and investment, where developing nations are increasingly trading with and investing in one another, reducing their dependence on Western markets. This shift is creating a more resilient economic environment, less susceptible to the monetary policy shifts of the Federal Reserve. Fund managers are particularly bullish on the consumer staples and technology sectors in these high-growth regions.\n\nNavigation of these markets requires deep local expertise and a keen understanding of geopolitical risks. Many successful funds are utilizing a 'boots on the ground' approach, with local research offices that provide a granular view of market dynamics that cannot be captured from a distance. Currency volatility remains a primary risk factor, though improved fiscal management in many developing nations has helped to stabilize exchange rates compared to previous cycles.\n\nAs we look ahead, the transition to green energy in the developing world presents a massive investment opportunity. Large-scale solar and wind projects, often supported by international development banks, are providing the sustainable energy needed to fuel further economic growth. Investors who can tolerate higher volatility may find that developing market funds offer the best potential for outsized gains over the next decade."
            },
            {
                title: "Retirement Planning: New Age Equity Funds",
                authors: "Investopedia",
                content: "Traditional retirement strategies are being updated for the modern era, with a new generation of 'Target-Outcome' equity funds designed to provide growth while protecting against significant market downturns. As lifespans increase and the reliability of social safety nets remains a concern, the need for robust, long-term equity exposure in retirement portfolios has never been greater. These new funds utilize sophisticated hedging techniques to provide a 'buffer' against the first 10-15% of market losses.\n\nThe core philosophy of these funds is to participate in the upside of the equity markets while defining the maximum downside risk. This approach is particularly appealing to 'pre-retirees' who are in the preservation phase of their investment lifecycle but cannot afford to miss out on the compounding power of stocks. By reducing volatility, these funds help investors stay committed to their long-term plans during periods of market turbulence.\n\nFinancial advisors are increasingly incorporating these buffered equity strategies into a broader 'bucket' approach to retirement income. This often involves combining traditional bond ladders for immediate income needs with growth-oriented equity funds for long-term purchasing power protection. The complexity of these products, however, requires careful due diligence and a clear understanding of the 'caps' on potential gains that often accompany the downside protection.\n\nIn conclusion, the evolution of retirement-focused equity funds is providing individuals with more tools to customize their risk profiles. As the investment landscape becomes more complex, the value of professional advice and well-structured, outcome-oriented mutual funds continues to grow. For those planning for a retirement that could span 30 years or more, balancing safety with growth is the ultimate challenge of 2026."
            },
            {
                title: "Dividend Growth Funds: Stability in Volatility",
                authors: "Yahoo Finance",
                content: "In a market environment characterized by fluctuating interest rates and geopolitical uncertainty, Dividend Growth Funds are re-emerging as a favorite for conservative and income-seeking investors alike. These funds focus on high-quality companies with a long history of not just paying, but consistently increasing their dividends. This track record is often a proxy for strong management, resilient business models, and healthy cash flows that can withstand economic cycles.\n\nThe power of reinvested dividends is a well-documented driver of total returns over time. In 2026, the compounding effect of these payouts is helping to offset the volatility seen in pure growth stocks. Many dividend achievers are found in defensive sectors like consumer staples, healthcare, and utilities, which tend to have more predictable earnings. This defensive posture provides a measure of comfort for investors during market corrections.\n\nHowever, 'dividend traps'—companies with unsustainably high yields that may be at risk of a cut—remain a significant risk. Fund managers in this space are using advanced forensic accounting tools to analyze payout ratios and free cash flow generation to ensure the safety of the dividends. The shift towards active management in the dividend space is driven by the need to navigate these risks and identify future dividend superstars before they are fully valued by the market.\n\nLooking forward, as many tech giants begin to mature and initiate their own dividend programs, the universe for dividend growth investing is expanding. This broadening of the sector is allowing for better diversification and higher growth potential than traditional 'high-yield' strategies. For investors seeking a balance of current income and long-term capital appreciation, Dividend Growth Funds offer a compelling solution for the current market reality."
            },
            {
                title: "Sector Specific Funds: Healthcare vs Tech",
                authors: "CNBC Finance",
                content: "The divergence between the healthcare and technology sectors has become one of the defining themes of the 2026 mutual fund landscape. Technology funds, having enjoyed a massive run driven by AI breakthroughs, are facing increased regulatory scrutiny and higher valuation hurdles. Meanwhile, Healthcare funds are benefiting from a wave of biotechnological innovation and an aging global population that is driving sustained demand for medical services and pharmaceuticals.\n\nIn the tech sector, the focus has shifted from pure growth to profitability and sustainable competitive advantages. Investors are becoming more discerning, favoring companies with strong software-as-a-service (SaaS) models and high switching costs. Conversely, the healthcare sector is seeing a renaissance in drug development, with new classes of weight-loss and oncology treatments reaching the market. These innovations are creating multi-billion dollar opportunities for established pharmaceutical giants and nimble biotech firms alike.\n\nSector rotation remains a key strategy for institutional investors looking to optimize their portfolio performance. Many fund managers are currently taking a 'barbell' approach, maintaining exposure to high-growth tech firms while hedging with defensive, value-oriented healthcare stocks. This strategy aims to capture the upside of technological progress while providing a safety net if the high-flying tech sector faces a significant correction.\n\nAs we move through the second half of 2026, the performance of these two sectors will likely be influenced by the outcome of the upcoming elections and potential changes to corporate tax policy. Regardless of the immediate market direction, the long-term secular trends—digitalization in tech and demographic shifts in healthcare—ensure that these two sectors will remain cornerstones of global mutual fund portfolios for years to come."
            },
            {
                title: "Understanding Index Fund Tracking Errors 2026",
                authors: "Seeking Alpha",
                content: "Index fund investing, once thought to be the simplest form of market participation, has become more complex as a result of market fragmentation and the proliferation of 'smart beta' strategies. A critical but often overlooked metric for investors is the 'tracking error'—the difference between the return of the index fund and its benchmark. In 2026, tracking errors have become more pronounced in certain sectors due to liquidity constraints and the high costs of frequent rebalancing.\n\nOne major factor contributing to tracking error is the 'transaction cost' associated with buying and selling the underlying securities in the index. As market volatility increases and bid-ask spreads widen, the cost for an index fund to replicate its benchmark increases, directly impacting the net returns for investors. Furthermore, the way different funds handle corporate actions like spin-offs or special dividends can also lead to deviations from the benchmark performance.\n\nInvestors are now paying closer attention to 'real-world' tracking errors rather than just the stated expense ratios. Many low-cost funds that appear attractive on the surface may actually have higher costs once tracking errors are factored in. The emergence of 'Direct Indexing'—where investors own the underlying stocks directly—is beginning to challenge traditional index mutual funds by offering better tax management and closer benchmark tracking.\n\nEducating investors on these nuances is essential for building realistic expectations about passive investment returns. While index funds remain a cornerstone of most diversified portfolios, understanding the drivers of tracking error is key to selecting the most efficient vehicles. In an era where every basis point of return matters, the efficiency of index replication is becoming a primary competitive advantage for fund providers."
            },
            {
                title: "Active vs Passive management: The 2026 Shift",
                authors: "Forbes Advisor",
                content: "The long-standing debate between active and passive management has entered a new phase in 2026, as high market concentration and increased volatility have created a fertile environment for skilled stock pickers. After a decade of dominance by passive index funds, active managers are finally showing an ability to consistently outperform their benchmarks by identifying winners in a crowded and complex market. This shift is particularly evident in the mid-cap and small-cap sectors where information inefficiencies are more common.\n\nThe 'passive bubble'—where massive inflows into index funds have artificially inflated the prices of large-cap stocks—is a frequent topic of concern among market strategists. As a result, many investors are re-introducing active management into their portfolios as a way to diversify away from these overvalued giants. Active managers are also proving their worth in risk management, utilizing their ability to move to cash or rotate sectors during periods of market stress, a luxury that passive funds do not have.\n\nHowever, the cost of active management remains a primary hurdle. To compete, many firms are introducing 'semi-active' or 'enhanced' index strategies that offer the low costs of passive investing with a modest overlay of active stock selection. This hybrid approach aims to capture the best of both worlds, providing broad market exposure with the potential for slight outperformance. Total fee transparency is now a minimum requirement for any active manager seeking to win back market share.\n\nThe 2026 landscape is one of 'complementarity' rather than 'competition.' Most successful institutional portfolios now utilize a combination of low-cost passive cores for broad market exposure and satellite active allocations for specific sectors or asset classes where alpha generation is most likely. This sophisticated approach reflects a more nuanced understanding of how to achieve long-term financial goals in a modern market."
            },
            {
                title: "Real Estate Mutual Funds: A 2026 Outlook",
                authors: "The Wall Street Journal",
                content: "The real estate mutual fund sector is navigating a complex recovery in 2026, as the industry adapts to permanently changed work-from-home patterns and a renewed focus on housing affordability. While commercial office space remains under pressure, other sectors like logistics, data centers, and multi-family residential are seeing robust growth. Real Estate Investment Trust (REIT) funds are increasingly specializing in these resilient sub-sectors to provide investors with more targeted exposure.\n\nThe rise of 'PropTech'—technological innovations in property management and transaction execution—is improving the efficiency and transparency of the real estate market. Funds that can identify the early adopters of these technologies are finding new ways to generate value in a competitive landscape. Sustainability is also becoming a key driver of property valuations, with 'Green Buildings' commanding higher rents and lower insurance costs.\n\nInterest rate stability is a major catalyst for the real estate sector, as predictable borrowing costs allow for more accurate valuation of properties. Following the volatility of the early 20s, the current period of relative rate calm is encouraging more development and investment activity. Real estate mutual funds offer retail investors a liquid way to participate in these large-scale property trends with professional diversification that would be impossible to achieve individually.\n\nInvestors in real estate funds should remain aware of the inherent risks, including regional economic downturns and potential regulatory changes affecting rent control or zoning. However, the unique income-generating characteristics and inflation-hedging potential of real estate make it a valuable component of a well-balanced portfolio. As the 2026 economy continues to evolve, the physical spaces where we live, work, and shop remain a fundamental driver of long-term wealth creation."
            }
        ];

        const youtubeMocks = [
            {
                title: "Open Ended Funds Research Q1 2026",
                authors: "Market Insights",
                content: "[00:00:05] Host: Welcome back to Market Insights. Today we're deep-diving into the Q1 results for major Open-Ended Mutual Funds.\n[00:01:20] Analyst Sarah: We're seeing a surprising resilience in growth-oriented funds despite the initial rate hikes in January.\n[00:03:45] Analyst Sarah: The top-performing decile has one thing in common: a high concentration in cybersecurity and climate-tech.\n[00:05:10] Host: What about outflows? Are retail investors getting spooked by the volatility?\n[00:07:30] Analyst Sarah: Actually, we're seeing more 'informed staying power'. Investors are starting to view these corrections as re-entry points rather than exit signals.\n[00:10:15] Analyst Sarah: Looking at the liquidity profiles, fund managers handled the March redemption spike with very little impact on the NAV.\n[00:12:50] Host: Closing thoughts on Q1? It's been a wild ride but the fundamentals seem to be holding up."
            },
            {
                title: "The Future of Mutual Funds: 2026 Trends",
                authors: "Finance Weekly",
                content: "[00:00:10] Intro: Finance Weekly explores the top 2026 trends that are changing the way you invest in mutual funds.\n[00:02:15] Guest Dr. Chen: Trend number one is the 'AI-Centric Alpha.' It's not just about more data, it's about the quality of the model's interpretation of geopolitical risk.\n[00:05:40] Guest Dr. Chen: Secondly, we're seeing 'Value-Based Customization.' Investors want their funds to reflect their personal ethics, not just a generic ESG score.\n[00:09:20] Host: How does this impact the fee structure? Customization usually comes with a premium.\n[00:11:50] Guest Dr. Chen: Surprisingly, automation is driving the cost of customized portfolios down. We expect actively managed customized funds to be price-competitive with index funds by next year.\n[00:14:30] Guest Dr. Chen: Finally, keep an eye on 'Direct Indexing.' It's starting to bleed into the mutual fund space, offering better tax efficiency for the average investor.\n[00:18:00] Outro: Stay ahead of the curve with Finance Weekly. Like and subscribe."
            },
            {
                title: "Mutual Fund Investment Strategy for Q2 2026",
                authors: "Investor Pro",
                content: "[00:00:00] Masterclass: Crafting your Q2 2026 Mutual Fund strategy. Let's get started.\n[00:03:30] Lead Strategist: Step 1: Rebalance your fixed-income exposure. With the Fed signaling a pause, longer duration bonds are back on the menu.\n[00:06:50] Lead Strategist: Step 2: Don't ignore the mid-caps. They've been overlooked for years and currently offer the best P/E ratios in the market.\n[00:12:15] Lead Strategist: Step 3: Check your international exposure. Europe is recovering faster than expected, and Southeast Asian tech is a sleeping giant.\n[00:18:40] Viewer Question: Should I put more into dividend funds or stay with growth?\n[00:20:10] Lead Strategist: In this phase of the cycle, a 60/40 split between high-quality dividends and speculative growth is my current recommendation.\n[00:25:30] Outro: Your future wealth is built on the decisions you make today. Plan wisely."
            },
            {
                title: "Understanding Fund Disclosures in 2026",
                authors: "Financial Education",
                content: "[00:00:15] Presenter: Today we are dissecting the new SEC and ESMA disclosure requirements for 2026. What does this mean for the average investor?\n[00:04:20] Presenter: Every mutual fund now must provide a 'Complexity Score' on the front page of their prospectus.\n[00:08:45] Presenter: You also need to look for the 'Total Cost of Ownership' figure, which includes hidden transaction and slippage costs.\n[00:12:30] Presenter: Fund managers are now required to disclose their own personal investment in the funds they manage. High 'skin in the game' is usually a good sign.\n[00:16:10] Presenter: Finally, understand the difference between 'Best Efforts' and 'Fiduciary' standards in the fine print.\n[00:21:00] Presenter: Knowledge is your best defense against bad products. Read the disclosures!"
            },
            {
                title: "How to Pick Mutual Funds in the 2026 Market",
                authors: "Wealth Academy",
                content: "[00:00:05] Coach: Welcome to Wealth Academy. Picking a mutual fund isn't just about looking at last year's performance.\n[00:03:10] Coach: The first filter should always be the 'Expense Ratio.' High fees kill your compounding over 20 years.\n[00:07:45] Coach: Second, look at the 'Manager Tenure.' You want a captain who has steered the ship through at least one major storm.\n[00:12:20] Coach: Third, check for 'Closet Indexing.' Don't pay active fees for a fund that just copies the S&P 500.\n[00:17:50] Coach: Finally, look at the 'Sharpe Ratio.' This tells you how much return you're getting for the risk you're taking.\n[00:22:40] Coach: Join our next session for a deep dive into individual fund reports."
            },
            {
                title: "Mutual Fund Tax Implications for 2026",
                authors: "Tax Smart Investing",
                content: "[00:00:20] Specialist: Tax season is coming earlier than you think. Let's talk about Mutual Fund tax efficiency.\n[00:05:15] Specialist: Watch out for 'Phantom Gains'—this is when a fund sells holdings and passes the tax bill to you, even if your account is down.\n[00:09:40] Specialist: Consider 'Tax-Managed Funds' specifically designed to minimize capital gains distributions.\n[00:13:30] Specialist: The difference between putting your funds in a 401k versus a taxable brokerage account can be hundreds of thousands over a lifetime.\n[00:18:20] Specialist: The new 2026 tax laws have changed the treatment of dividends. Consult your advisor for the new brackets.\n[00:23:00] Specialist: Don't let taxes be the tail that wags the investment dog, but definitely keep them in mind."
            },
            {
                title: "The Rise of Green Mutual Funds in 2026",
                authors: "EcoInvest Channel",
                content: "[00:00:10] Host: The 'Green Wave' isn't just a trend anymore; it's a structural shift in global capital. Let's look at the top green funds of 2026.\n[00:04:30] Expert: We're seeing massive capital flows into 'Nature-Positive' funds that invest in sustainable agriculture and water conservation.\n[00:09:15] Expert: The return profiles are finally matching up with traditional energy funds as the cost of renewables continues to drop.\n[00:14:40] Host: Is this just a Europe thing, or is the rest of the world catching up?\n[00:17:20] Expert: The fastest-growing green funds are actually coming out of the APAC region right now, particularly in solar infrastructure.\n[00:22:00] Expert: Investing in the planet's future can also be a smart way to invest in your own. Here's why."
            },
            {
                title: "Mutual Fund Performance Review: H1 2026",
                authors: "Capital Daily",
                content: "[00:00:15] News Anchor: Capital Daily's half-year review. The winners and losers of the mutual fund world in 2026.\n[00:03:45] Analyst: Value funds are finally having their day in the sun, outperforming growth for the second straight quarter.\n[00:08:10] Analyst: The 'Mag 7' dominance has faded, replaced by 'The Industrial 10'—the manufacturers behind the infrastructure boom.\n[00:13:20] News Anchor: What's the outlook for the second half? More of the same or a pivot?\n[00:16:50] Analyst: Expect a pivot towards small-caps once the interest rate cuts are officially announced. The smart money is already moving.\n[00:20:30] Outro: Stay tuned for tomorrow's deeper look at international emerging markets."
            },
            {
                title: "Mastering Asset Allocation in 2026",
                authors: "Smart Money Tips",
                content: "[00:00:00] Intro: Stop picking stocks and start picking asset classes. Mastering asset allocation in the current 2026 climate.\n[00:04:15] Coach: The 60/40 is dead. The modern portfolio is more like 40/30/15/15—Equities, Bonds, Real Assets, and Liquid Alts.\n[00:09:30] Coach: Liquid Alternatives, like hedge fund-style mutual funds, are providing zero-correlation returns that are saving portfolios this year.\n[00:14:50] Coach: Your age minus 10 is no longer a good rule for your bond allocation. The math has changed because we are living longer.\n[00:20:10] Coach: Dynamic rebalancing—adjusting your weightings based on market signals—is the only way to stay resilient today.\n[00:24:00] Outro: Diversification is the only free lunch in investing. Eat up."
            },
            {
                title: "Mutual Fund Exit Strategies for 2026",
                authors: "Exit Edge",
                content: "[00:00:20] Strategist: Everyone talks about when to buy, but nobody talks about when to sell. Let's fix that.\n[00:05:40] Strategist: Reason 1 to sell: Persistent underperformance against the benchmark for more than three years. Don't be too patient.\n[00:10:15] Strategist: Reason 2: Style Drift. If your 'Value Fund' is suddenly buying high-priced tech stocks, the manager has lost their way.\n[00:15:30] Strategist: Reason 3: A change in your own life goals or risk tolerance. Your portfolio should serve your life, not the other way around.\n[00:20:45] Strategist: Always consider the tax consequences before you pull the trigger. Sometimes staying in a bad fund is cheaper than paying the tax.\n[00:25:00] Outro: Know your exit before you ever make your entrance."
            }
        ];

        if (type === 'website') {
            const randomMock = websiteMocks[Math.floor(Math.random() * websiteMocks.length)];
            mockSource = {
                ...mockSource,
                title: randomMock.title,
                authors: randomMock.authors,
                abstract: randomMock.content,
                sourceType: 'website',
                isMock: true,
                aiSummary: `**Key Insights:**\n- **Market Shift:** The article highlights a significant shift towards ${randomMock.title.toLowerCase().includes('bond') ? 'fixed income' : 'sustainable'} strategies in 2026.\n- **Risk Factors:** Institutional investors are cautioned about volatility in emerging markets.\n- **Opportunity:** ${randomMock.title.includes('ESG') ? 'Green bonds' : 'Mid-cap equities'} are projected to outperform major indices.\n\n**Summary:**\nThis article from ${randomMock.authors} provides a comprehensive analysis of the current market landscape. It suggests that while traditional indicators remain relevant, the underlying drivers of growth have evolved. The author argues for a more dynamic approach to asset allocation, specifically targeting sectors that benefit from the new inflationary environment.`
            };
        } else if (type === 'youtube') {
            const randomMock = youtubeMocks[Math.floor(Math.random() * youtubeMocks.length)];
            mockSource = {
                ...mockSource,
                title: randomMock.title,
                authors: randomMock.authors,
                abstract: randomMock.content,
                sourceType: 'video',
                isMock: true,
                aiSummary: `**Video Highlights:**\n- **00:02:15:** The speaker introduces the concept of 'AI-Centric Alpha' as a game changer.\n- **00:08:45:** Discussion on the hidden costs of passive investing in high-volatility regimes.\n- **00:14:30:** A compelling argument for Direct Indexing for tax efficiency.\n\n**Executive Summary:**\nIn this episode of "${randomMock.title}", the host dives deep into the structural changes facing the mutual fund industry. The key takeaway is that technology is no longer just an operation tool but a core investment driver. The discussion also touches on the democratization of sophisticated financial tools for retail investors.`
            };
        } else if (type === 'text') {
            mockSource = {
                ...mockSource,
                title: "Compliance Notes: Fund Disclosure Review",
                authors: "System Export",
                sourceType: 'text',
                isMock: true,
                aiSummary: "**Overview:**\ninternal compliance notes regarding the latest fund disclosure requirements.\n\n**Action Items:**\n- Review new SEC guidelines.\n- Update prospectus language.\n- Verify fee structure disclosure."
            };
        }

        onAddSource(mockSource);
        onClose();
    };

    const [linkUrl, setLinkUrl] = useState('');
    const [sourceType, setSourceType] = useState<string>('website');

    const handleExecute = () => {
        // For the manual execute, we'll just pick a random mock of the selected type
        // or create a generic one if it's 'document'/'audio' which we don't have deep mocks for
        let type: 'website' | 'youtube' | 'text' = 'website';
        if (sourceType === 'video') type = 'youtube';
        if (sourceType === 'document' || sourceType === 'audio') type = 'text'; // Fallback for now

        handleMockAdd(type);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
                    >
                        <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden pointer-events-auto flex flex-col transition-colors ${isFundBuzz ? 'bg-white border-slate-200' : 'bg-slate-800 border-white/10'}`}>
                            {/* Header */}
                            <div className={`p-6 flex items-center justify-between border-b ${isFundBuzz ? 'bg-white border-slate-100' : 'bg-slate-800 border-white/5'}`}>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                                        <img src={theme.logo} alt={`${theme.displayName} Logo`} className="w-full h-full object-cover" />
                                    </div>
                                    <span className={`font-semibold text-lg ${isFundBuzz ? 'text-slate-900' : 'text-white'}`}>{theme.displayName}</span>
                                </div>
                                <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isFundBuzz ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/5 text-gray-400'}`}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Main Content */}
                            <div className="p-8 space-y-6">
                                <div>
                                    <h2 className={`text-xl font-medium mb-4 ${isFundBuzz ? 'text-slate-900' : 'text-white'}`}>Add Source</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isFundBuzz ? 'text-slate-700' : 'text-gray-300'}`}>Link URL</label>
                                            <div className="relative">
                                                <LinkIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isFundBuzz ? 'text-slate-400' : 'text-gray-500'}`} />
                                                <input
                                                    type="text"
                                                    value={linkUrl}
                                                    onChange={(e) => setLinkUrl(e.target.value)}
                                                    placeholder="Paste link here..."
                                                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${isFundBuzz ? 'bg-white border-slate-200 focus:ring-blue-500/20 text-slate-900' : 'bg-white/5 border-white/10 focus:ring-blue-500/20 text-white placeholder-gray-500'}`}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isFundBuzz ? 'text-slate-700' : 'text-gray-300'}`}>Type</label>
                                            <select
                                                value={sourceType}
                                                onChange={(e) => setSourceType(e.target.value)}
                                                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none appearance-none ${isFundBuzz ? 'bg-white border-slate-200 focus:ring-blue-500/20 text-slate-900' : 'bg-white/5 border-white/10 focus:ring-blue-500/20 text-white'}`}
                                            >
                                                <option value="website">Website</option>
                                                <option value="video">Video</option>
                                                <option value="audio">Audio</option>
                                                <option value="document">Document</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className={`p-6 border-t flex items-center justify-between ${isFundBuzz ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-white/5'}`}>
                                {/* Secondary Demo Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleMockAdd('website')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${isFundBuzz ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'}`}
                                    >
                                        <Globe className="w-4 h-4" />
                                        Website
                                    </button>
                                    <button
                                        onClick={() => handleMockAdd('youtube')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${isFundBuzz ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'}`}
                                    >
                                        <Youtube className="w-4 h-4 text-red-500" />
                                        Video
                                    </button>
                                </div>

                                {/* Primary CTA */}
                                <button
                                    onClick={handleExecute}
                                    className={`px-6 py-2 rounded-full font-medium transition-colors shadow-lg shadow-blue-500/20 ${isFundBuzz ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    Execute
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

