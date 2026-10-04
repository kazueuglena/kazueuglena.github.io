import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import ReactGA from 'react-ga4';


// --- News Image Context ---
const newsContext = require.context('./assets/images_news', true, /\.(png|jpe?g|svg)$/i);
const getNewsImages = (folderName) => {
    return newsContext.keys()
        .filter(key => key.includes(`/${folderName}/`))
        .map(key => newsContext(key));
};

// --- Media Image Context ---
const mediaContext = require.context('./assets/images_media', false, /\.(png|jpe?g|svg)$/i);
const getMediaImage = (fileName) => {
    if (!fileName) return "";
    const match = mediaContext.keys().find(key => key.includes(fileName));
    return match ? mediaContext(match) : "";
};

// --- 多言語コンテンツ ---
const content = {
    ja: {
        nav: { profile: "Profile", vision: "Vision", news: "News", research: "Research", projects: "Projects", map: "Map", insights: "Insights", activities: "Activities", media: "Media", contact: "Contact" },
        ui: {
            read_more: "Read more",
            click_for_details: "詳細を見る",
            featured_project: "Featured project",
            back: "Back",
            award_label: "Award",
            grant_label: "Grant",
            copy: "Copy email",
            click_to_copy: "Click to Copy",
            copied: "Copied",
            view: "View",
            designed_with: "Designed with Botanical Intelligence.",
            back_to_main: "Back to Main Page",
            scroll: "Scroll",
            view_website: "関連情報を見る",
            view_all_insights: "View all",
            insight_details: "詳細",
            all: "すべて"
        },
        hero: {
            title: "Intelligence is Connection",
            subtitle: "知能は、つながりから立ち現れるのか。",
            name_label: "Kazuhiro Komatsu | Student"
        },
        profile: {
            title: "Profile",
            name: "小松 和滉",
            affiliation: "長野県諏訪清陵高等学校",
            description: "異なる領域が繋がることでこそ、新たな「知」が生まれると信じています。\n\n私は、長野県を拠点に「生物学×情報工学」という学際的な視点からオジギソウの環境ストレスへの応答（馴化）を研究するとともに、地方と都市の教育格差を解消するための科学教育活動を展開してきました。脳を持たない植物が、いかに環境の変化を感じ取り、応答を最適化していくのか——その仕組みの解明は、気候変動が進む世界でも安定して実る作物の育種や、持続可能な食料生産という農学の課題へと必ずつながっていくと考えています。\n研究室の知見と社会の課題、最先端のテクノロジーと地方の子どもたち。それら分断されがちな世界を滑らかにつなぐ「架け橋」となることで、新たな可能性を拓いていきます。",
            cv_button: "CVを見る"
        },
        vision: {
            title: "Vision",
            heading: "知能の定義を、問い直す。",
            description: "知能とは、脳や神経系を持つ生き物だけのものなのでしょうか。私はこの前提そのものを問い直したいと考えています。\n\nオジギソウは、脳という中枢を持たないまま、全身に広がる分散的なネットワークで刺激に応答し、馴化様の振る舞いを見せます。こうした現象は、統合情報理論や基底的認知（basal cognition）といった枠組みが投げかける問い——知能を器官にではなく、要素の相互作用というシステムの側に見いだせるか——と静かに響き合います。もちろん、植物が意識や感情を持つと主張するつもりはありません。応答の減弱が「学習」なのか、より単純な生理過程なのかも、まだ開かれた問いです。だからこそ私は、断定ではなく検証を積み重ね、生命に共通する情報処理の原理がありうるのかを、実証と理論の両面から確かめていきたいと思っています。\n\nそして、脳を持たない植物が環境ストレスに適応する原理を解き明かすことは、知能の謎に迫るだけにとどまりません。それは、気候変動が進む世界でも安定して実る作物の育種や、持続可能な食料生産という農学の課題へと確かにつながっており、私は基礎研究で得た知を、最終的には人類の食と農を支える力へと還元していきたいと考えています。",
        },
        news: {
            title: "News",
            items: [
                {
                    id: "new-website",
                    published: true,
                    date: "2025.07.15",
                    title: "ポートフォリオサイトを大幅リニューアル",
                    summary: "インタラクティブな機能を追加し、ウェブサイトを全面的に更新しました。",
                    fullContent: "本日、ポートフォリオサイトを大幅にリニューアルしました。これまでの活動内容の拡充に加え、新たにNewsセクション、インタラクティブな活動マップなどを追加しました。これにより、私の活動の現在・過去・未来をより深く、そして楽しく知っていただけるようになったと信じています。ぜひサイト内を探索してみてください。<br><br><a href='https://sites.google.com/view/kazuhirokomatsu' target='_blank' rel='noopener noreferrer' class='text-[#a7b08f] hover:underline'>以前のサイトはこちら</a>",
                    images: getNewsImages("new_website")
                },
                {
                    id: "acmb-jsmb-2025",
                    published: true,
                    date: "2025.07.11",
                    title: "ACMB-JSMB2025にてポスター発表",
                    summary: "ACMB-JSMB2025にて、植物の刺激馴化メカニズムに関する研究成果をポスター発表しました。",
                    fullContent: "ACMB-JSMB2025（Asian Conference on Mathematical Biology と Annual Meeting of Japanese Society for Mathematical Biology の合同会議）にて、私の研究テーマであるオジギソウの刺激馴化メカニズムに関するポスター発表を行いました。この合同会議は、数理生物学の分野におけるアジア地域および日本の最先端の研究が一堂に会する重要な学術イベントです。\n発表では、植物が環境刺激にどのように適応し、その応答を変化させるのかというメカニズムについて、数理的なアプローチやモデル構築を通じて得られた新たな知見を共有しました。特に、オジギソウの「記憶」とも言える刺激馴化現象を、数理モデルを用いて解析した成果について、参加された研究者の方々と活発な議論を行うことができ、非常に有意義な時間となりました。",
                    images: getNewsImages("ACMBJSMB")
                },
                {
                    id: "asc-2025",
                    published: true,
                    date: "2025.08.07",
                    title: "Asian Science Camp 2025に参加",
                    summary: "ノーベル賞受賞者を含めた数多くの研究者の方やアジア各国からの高校生大学生参加者と交流しました。",
                    fullContent: "2025年7月31日から8月6日にかけてタイで開催された、Asian Science Camp 2025 (ASC2025) に、日本代表団の一員として参加しました。本キャンプは、ノーベル賞受賞者や世界のトップレベルの研究者による講演、そしてアジア各国から選抜された高校生・大学生との交流を通じて、次世代の科学者を育成することを目的とした国際的なプログラムです。\n期間中は、多岐にわたる科学分野の講演聴講に加え、講師や参加者を交えたディスカッション、グループでのポスターセッションに参加しました。各国の参加者との議論を通じて、多様な科学的視点やアプローチに触れることができ、大変有意義な時間となりました。本キャンプで得た国際的な経験と知見を、今後の自身の研究活動に活かしていきたいと考えています。",
                    images: getNewsImages("ASC2025")
                },
                {
                    id: "expo-workshop-announce",
                    published: true,
                    date: "2025.08.11",
                    title: "【告知】8/24 大阪万博にてWS開催",
                    summary: "植物に関するワークショップを8月24日に大阪・関西万博2025「いのちの遊び場 クラゲ館」にて行います。",
                    fullContent: "来る2025年8月24日（日）、大阪・関西万博のパビリオン「いのちの遊び場 クラゲ館」にて、私が企画・案内するワークショップ『植物と人がともに紡ぐ共生の風景　ー触って学ぶ植物の能力』を開催します。\n\nこの企画は、植物が持つ驚くべき能力を、見て、触れて、直感的に体験していただく参加型のイベントです。会場内には「オジギソウ触れ合い」「就眠運動観察」「電気信号可視化」など、私の研究に基づいた5つのステーションを設置します。参加者の皆様には、これらのステーションを自由に巡りながら植物の神秘を発見し、人と植物が共創する未来のビジョンを一緒に描いていきたいと考えています。\n\n皆様のご来場を心よりお待ちしております。\n\n【開催概要】\n■日時: 2025年8月24日（日） 10:15 - 13:15\n■場所: 大阪・関西万博2025 いのちの遊び場 クラゲ館「いのちのゆらぎ場」\n■参加方法: 予約不要（先着順となります）\n\n※状況により、内容の変更や中止となる可能性があります。予めご了承ください。",
                    images: getNewsImages("Expo2025")
                },
                {
                    id: "expo-workshop-report",
                    published: true,
                    date: "2025.08.24",
                    title: "大阪・関西万博2025にてワークショップを開催しました",
                    summary: "大阪・関西万博のパビリオン『いのちの遊び場 クラゲ館』にて、オジギソウをテーマにした科学ワークショップを企画・開催しました。",
                    fullContent: "2025年8月24日、大阪・関西万博のパビリオン「いのちの遊び場 クラゲ館」にて、私が企画・案内するワークショップ『植物と人がともに紡ぐ共生の風景　ー触って学ぶ植物の能力』を無事開催いたしました。<br><br>このワークショップは、私の研究テーマであるオジギソウの不思議な能力を通して、子どもから大人まで多くの皆さんに科学の面白さを体験してもらうことを目的としたものです。世界中から人々が集まるこの特別な場所で、このような機会を頂けたことに心から感謝しています。<br><br>当日は、植物の能力を直感的に体験できる5つのステーションを用意しました。特に「オジギソウ触れ合いステーション」では、実際に触れると葉を閉じる様子に、子どもたちから大きな驚きと歓声が上がりました。「なぜ動くの？」「どうなってるの？」と輝く目で質問してくれる姿を見て、科学の種を未来に届けられた手応えを感じ、非常に感動的な一日となりました。<br><br>今回の経験は、自身の研究内容を社会に還元することの重要性と喜びを改めて教えてくれました。この貴重な学びを、今後の研究活動はもちろん、長野での「サイエンス出前便」などの科学教育プロジェクトにも活かしていきたいと思います。<br><br>最後になりましたが、ご来場いただいた皆様、そして開催にあたり多大なるご支援をいただいた万博関係者の皆様、クラゲ館スタッフの皆様に、心より御礼申し上げます。",
                    images: getNewsImages("expo_workshop")
                },
                {
                    id: "jbs-2025",
                    published: true,
                    date: "2025.09.20",
                    title: "第89回日本植物学会 高校生ポスター発表にて発表&受賞",
                    summary: "日本植物学会にてポスター発表を行いました。多くの研究者の方々と議論でき、大変貴重な経験となりました。",
                    fullContent: "2025年9月20日（土）、福岡国際会議場で開催された「第89回日本植物学会」の高校生ポスター発表部門に参加しました。<br><br>本学会は、日本の植物科学研究における最大級の学術集会の一つです。今回は、新たに構築した実験系から得られた最新のデータを基に、自身の研究成果を発表しました。<br><br>当日は、ポスターセッションを通じて、国内外の第一線で活躍される多くの研究者の方々と直接議論を交わす機会に恵まれました。当日は4時間にわたりディスカッションを行い、自身の研究に対する多角的なフィードバックや、今後の研究の発展に繋がる貴重な助言をいただくことができ、大変有意義な時間となりました。<br><br>その結果、幸運にもポスター発表に対して賞をいただくことができました。この受賞を励みに、今後もさらなる探究を進めてまいります。<br><br>ご指導いただいた先生方、並びに当日ブースにて熱心に議論してくださった皆様に、この場を借りて心より御礼申し上げます。",
                    images: getNewsImages("JBS2025")
                },
                {
                    id: "rohto-future-2025",
                    published: true,
                    date: "2025.09.28",
                    title: "ロート製薬・リバネス共創プロジェクトにて未来提案プレゼンを実施",
                    summary: "2100年における精神疾患に対する解決策を大阪駅前で発表しました。",
                    fullContent: "2025年9月28日（日）、大阪駅前の「グラングリーン大阪」にて開催された、ロート製薬株式会社様と株式会社リバネス様が共催するプロジェクト成果報告会にてプレゼンテーションを行いました。<br><br>本プロジェクトは、大阪・関西万博を契機に、高校生が未来の社会課題を探究し「未来の研究テーマ」を創出することを目的としたものです。私はチームの一員として「2100年における精神疾患」という壮大なテーマに2ヶ月以上にわたって取り組みました。<br><br>発表に至るまで、チームでのオンラインディスカッションを重ねたほか、実際に大阪万博にも足を運び、未来の医療や社会に対する知見を深めました。当日は、これまで練り上げてきたアイデアを発表できただけでなく、他のチームの提案についても活発なディスカッションを行い、大変充実した時間となりました。<br><br>今回のプロジェクトを通じて、これまで取り組んできたオジギソウや数理モデルといった基礎研究の知見を、いかにして社会実装に繋げるかという応用科学の視点を強く意識するようになりました。これは私自身の研究者としてのキャリアを考える上で、非常に大きな転機となる貴重な経験です。<br><br>このような素晴らしい機会をくださったロート製薬株式会社の皆様、株式会社リバネスの皆様、共に探究を深めたチームメンバー、そして関係者の皆様に心より感謝申し上げます。",
                    images: getNewsImages("RohtoFuture2025")
                },
                {
                    id: "nagano-gakkasyo2025",
                    published: true,
                    date: "2025.10.04",
                    title: "長野県学生科学賞にて県知事賞を受賞",
                    summary: "オジギソウの「馴化様」現象を画像解析技術を用いて解明した研究により、最高賞である長野県知事賞を受賞しました。",
                    fullContent: "2025年10月に行われた長野県学生科学賞の審査会において、私の研究プロジェクトが最高賞にあたる「県知事賞」を受賞いたしました。<br><br>研究テーマは『植物は刺激を学習するのか -オジギソウの特定の刺激に対する馴化の定量的解析』です。植物が繰り返される刺激に対して反応しなくなる「馴化（慣れ）」という現象は、植物における原始的な「記憶・学習」能力として注目されています。<br><br>本研究の鍵となったのは、これまで目視や単純な計測に頼っていた植物の挙動を、高精度な「画像」データとして捉え直した点です。自作の撮影装置と解析プログラムを駆使し、葉の開閉運動を数値化・可視化することで、これまで曖昧だったオジギソウの応答調節能力を定量的に示すことに成功しました。<br><br>生物学的な観察と、情報工学的な解析手法を「繋ぐ」このアプローチが評価されたことは、私にとって大きな自信となりました。<br><br>今後は、この長野県代表として進む日本学生科学賞（中央審査）に向けて、さらなるデータ検証と論理の精査を進めてまいります。日頃より熱心にご指導いただいている先生方、議論を交わした友人、そして研究活動を支えてくださる全ての皆様に心より感謝申し上げます。",
                    images: getNewsImages("NaganoGakkasyo2025")
                },
                {
                    id: "UTokyoGSC-seika",
                    published: true,
                    date: "2025.11.15",
                    title: "UTokyoGSC-NEXT 第3段階 成果発表会にて研究成果を発表",
                    summary: "東京大学・末次研究室での指導のもと取り組んだオジギソウの研究成果を発表。多くの刺激を受けました。",
                    fullContent: "2025年11月15日、東京大学グローバルサイエンスキャンパス（UTokyoGSC-Next）の第3段階成果発表会に参加しました。私は東京大学の末次憲之先生の研究室にてご指導いただき、研究活動を行ってきましたが、今回はその一区切りとなる集大成の発表でした。<br><br>私の研究テーマである「オジギソウの馴化」について、末次研究室の高度な環境で得られた知見と、自作システムによる「画像」解析の結果を交えてプレゼンテーションを行いました。<br><br>当日は、共に第3段階を走り抜けた仲間の発表に加え、これから本格的な研究に入る第2段階生のユニークで面白い研究計画も聞くことができ、その発想の豊かさに驚かされました。学年や段階を超えて科学への情熱を「繋ぐ」交流の場に参加できたことは、私にとって大きな財産です。<br><br>末次先生をはじめ、研究室の皆様、そして事務局の方々に深く感謝いたします。ここで得た経験を糧に、今後も研究活動に邁進していきます。",
                    images: getNewsImages("UTokyoGSC")
                },
                {
                    id: "koushien",
                    published: true,
                    date: "2025.11.29",
                    title: "科学の甲子園 長野県予選にて準優勝（実技部門1位）",
                    summary: "生物担当としてチームに貢献。実技競技では全体1位を獲得しましたが、惜しくも総合2位で全国大会出場はなりませんでした。",
                    fullContent: "2025年11月29日、「科学の甲子園」長野県予選に学校代表チームの一員（生物担当）として出場しました。<br><br>結果は、県内総合2位。優勝チームのみに与えられる全国大会への切符には、あと一歩届きませんでした。<br><br>筆記競技で点数を伸ばしきれなかった悔しさは残りますが、チームワークが試される「実技競技」においては、全体1位という最高の結果を残すことができました。専門分野の異なるメンバーが知恵を出し合い、課題解決に取り組んだプロセスは非常に濃密な時間でした。<br><br>また、競技を通じて県内の他の高校の科学好きの生徒たちと交流し、学校の枠を超えて「繋がる」ことができたのは大きな収穫です。ここで得たネットワークと、あと少しで届かなかった悔しさをバネに、個人の研究活動でもさらに高みを目指していきたいと思います。",
                    images: getNewsImages("Koushien")
                },
                {
                    id: "mbsj-2025",
                    published: true,
                    date: "2025.12.05",
                    title: "第48回日本分子生物学会年会にてポスター発表",
                    summary: "パシフィコ横浜で開催された国内最大級の学会にて、オジギソウとヒドラに関する2つの研究成果を発表しました。",
                    fullContent: "2025年12月5日、パシフィコ横浜で開催された「第48回日本分子生物学会年会」の高校生発表部門に参加しました。<br><br>今回は2つのテーマについて発表を行いました。1つ目は、自身のメインテーマである「オジギソウの刺激馴化」についてで、特に数理モデルを用いた解析結果を中心に発表しました。2つ目は、学校の課題研究として友人と共同で取り組んでいる「ヒドラ」に関する研究です。<br><br>会場は非常に大きく、その規模に圧倒されましたが、自分の研究分野と近いセッションもあり、最先端の知見に触れることができ大変勉強になりました。多くの専門家の方々と議論できたことは大きな財産です。",
                    images: getNewsImages("MBSJ2025")
                },
                {
                    id: "sc-world-2025",
                    published: true,
                    date: "2025.12.13",
                    title: "サイエンスキャッスルワールド2025にて発表",
                    summary: "東京科学大学で開催された研究発表会に参加。受賞は逃しましたが、国内外の仲間との貴重な交流の機会となりました。",
                    fullContent: "2025年12月13日、東京科学大学（旧東京工業大学）にて開催された「サイエンスキャッスルワールド 2025」にポスター発表で参加しました。<br><br>今回は残念ながら受賞には至りませんでしたが、それ以上に得難い経験をすることができました。特にかねてよりお話ししたいと思っていた先輩と直接お会いできたことや、海外からの参加者と英語でディスカッションできたことは、自分にとって大きな刺激となりました。<br><br>また、これまでの科学活動を通じて親交のあった友人たちとも再会し、互いの研究や近況について語り合うことができました。結果以上に、研究を通じた「人との繋がり」を強く実感する、大変素晴らしい機会となりました。",
                    images: getNewsImages("SCWorld2025")
                },
                {
                    id: "Gakkasyo-2025",
                    published: true,
                    date: "2025.12.19",
                    title: "【速報】日本学生科学賞にて大臣賞受賞 & ISEF出場決定",
                    summary: "日本学生科学賞にて「科学技術政策担当大臣賞」を受賞し、世界大会ISEFへの出場権を獲得しました。秋篠宮皇嗣殿下や小野田大臣より激励のお言葉を賜りました。",
                    fullContent: "第69回日本学生科学賞の中央表彰式にて、「科学技術政策担当大臣賞」（全国5位相当）を受賞いたしました。また、これにより来年5月にアメリカで開催される世界最大の学生科学コンテスト「ISEF（国際学生科学技術フェア）」への日本代表派遣が決定しました。\n\n今回は優れた研究が数多くある中で選出いただき、運や巡り合わせにも恵まれたと感じています。また、現状の評価には「高校生である」というある種の加点が含まれていると自覚しています。今後はそうした枠組みを超え、一人の「研究者」として純粋に研究内容で評価されるよう、より一層精進したいという決意を新たにしました。\n\n式典後には、秋篠宮皇嗣殿下と懇談させていただく機会を賜りました。研究内容についてのご質問や背中を押していただくお言葉をいただき、大変励みになりました。また、小野田内閣府特命担当大臣（科学技術政策担当）とも握手をさせていただき、研究について直接お話しすることができました。\n\n会場で出会った同世代の優れた研究者たちとの繋がりも、私にとって大きな財産です。この縁を大切にしながら、世界の舞台でも全力を尽くしてきます。",
                    images: getNewsImages("Gakkasyo-2025")
                },
                {
                    id: "ABA-Symposium-2026",
                    published: true,
                    date: "2026.01.14",
                    title: "【香港】第12回アジア生物物理学会にて口頭発表・ポスター発表",
                    summary: "香港で開催されたABA Symposiumに参加し、英語でのポスター発表と自身初となる口頭発表を行いました。高校生ながら挑戦の機会をいただき、生物物理学の面白さと、海外単独渡航を通じた個人の成長を実感しました。",
                    fullContent: "1月12日・13日に香港科技大学で開催された「The 12th Asian Biophysics Association (ABA) Symposium」に参加しました。今回は英語でのポスター発表に加え、自身初となるOral Presentation（口頭発表）にも挑戦しました。\n\n採択から本番までの期間が極めて短く、前日の夜まで原稿が完成しないという過酷な状況でしたが、いざ本番では「自分の研究を伝えたい」という熱意が勝り、自分でも驚くほどスムーズに発表を行うことができました（同時に、基礎的な英語力の不足も痛感しました）。\n\n学会では、膜タンパク質の専門家など今後の研究に不可欠な先生方と繋がることができました。これまでのマクロ的なアプローチに加え、今後は刺激受容センサー（膜タンパク）というミクロな視点も取り入れて研究を深化させていきます。生物物理学という分野の面白さに触れられたことも大きな収穫でした。\n\nまた、今回は完全な単独渡航でした。準備不足が災いし、ホテルや航空券の手配で深刻なトラブルに見舞われましたが、その分、周囲のサポートのありがたさを痛感しました。エキゾチックな香港の文化に触れ、研究者としてだけでなく、人としても一回り成長できた気がします。\n\n分野外かつ高校生の私を口頭発表に採択してくださった事務局の皆様、ご支援いただいた日本科学協会様、そしてトラブルの際に助けてくれた家族（特に母）に心から感謝申し上げます。",
                    images: getNewsImages("ABA-Symposium-2026"),
                    link: "https://xiiaba.hkust.edu.hk/"
                },
                {
                    id: "isef-virtual-project-board-2026",
                    published: true,
                    date: "2026.04.18",
                    title: "ISEF 2026のプロジェクトページが公開されました",
                    summary: "アメリカで開催されるISEF(国際学生科学技術フェア)の公式Virtual Project Boardにて、私のプロジェクトページが公開されました。",
                    fullContent: "2026年5月にアメリカのロサンゼルスで開催される「ISEF（国際学生科学技術フェア）」に向けて、公式のVirtual Project Boardにて私のプロジェクトページが公開されました。<br><br>プロジェクトのタイトルは「Stimulus Discrimination and Memory in M. pudica」です。世界中の方々に私のオジギソウ研究について知っていただく機会となることを大変嬉しく思います。皆様、ぜひ以下のリンクからご覧ください。",
                    images: getNewsImages("ISEF-pre"),
                    link: "https://isef.net/project/plnt017-stimulus-discrimination-and-memory-in-m-pudica"
                },
                {
                    id: "rhabit-release-2026",
                    published: true,
                    date: "2026.04.18",
                    title: "iOSアプリ「rHabit」をリリースしました",
                    summary: "集中作業中の「無意識のクセ（口開きなど）」をAIで検知し、改善をサポートするトラッキングアプリを開発・公開しました。",
                    fullContent: "勉強やPC作業に深く集中している最中に、無意識に口が開いてしまうことはありませんか？顔認識AIを用いてこれら「無意識のクセ」をリアルタイムに検知し、改善をサポートするiOSアプリ「rHabit」を独自開発し、App Storeにて公開しました。<br><br>iPhoneのFace ID技術を活用した完全ローカル処理により、集中を阻害することなくトラッキングします。「どれくらい口が開いたら検知するか」などのカスタマイズも可能で、クセが出た瞬間に静かなバイブレーションで気づきを与えます。自身の研究活動など長時間の集中での実体験に基づき開発したアプリです。<br><br>詳細は<a href='https://kazueuglena.github.io/rHabit/' target='_blank' rel='noopener noreferrer' class='text-[#a7b08f] hover:underline'>公式サイト</a>、または<a href='https://apps.apple.com/jp/app/rhabit-%E7%84%A1%E6%84%8F%E8%AD%98%E3%81%AE%E3%82%AF%E3%82%BB%E6%94%B9%E5%96%84/id6761792769?l=en-US' target='_blank' rel='noopener noreferrer' class='text-[#a7b08f] hover:underline'>App Store</a>からご覧いただけます。",
                    images: getNewsImages("rHabit"),
                    link: "https://apps.apple.com/jp/app/rhabit-%E7%84%A1%E6%84%8F%E8%AD%98%E3%81%AE%E3%82%AF%E3%82%BB%E6%94%B9%E5%96%84/id6761792769"
                },
                {
                    id: "isef-award-2026",
                    published: true,
                    date: "2026.05.15",
                    title: "【速報】Regeneron ISEF 2026にて3賞同時受賞",
                    summary: "リジェネロン国際学生科学技術フェア（ISEF 2026）にて、植物科学部門優秀賞2等（世界2位）をはじめ、アリゾナ州立大学賞、TÜBİTAK賞1等の計3賞を同時受賞しました。",
                    fullContent: "アメリカ・アリゾナ州フェニックスにて開催された、高校生の国際的な科学研究コンテスト「リジェネロン国際学生科学技術フェア（Regeneron ISEF 2026）」に日本代表の一員として出場し、植物科学（Plant Sciences）部門にて研究発表を行いました。<br><br>現地時間5月14日午後の特別賞授賞式（Special Award Ceremony）、翌15日午前の優秀賞授賞式（Grand Award Ceremony）にて、部門優秀賞2等（世界2位）をはじめ、協賛団体から贈られる特別賞のアリゾナ州立大学賞、およびトルコ科学技術研究会議（TÜBİTAK）賞1等の計3つの賞を同時に受賞いたしました。日本代表のファイナリストが優秀賞と2つの特別賞を同時に受賞するのは、12年ぶりの快挙です。<br><br>研究タイトルは「Learning Without a Brain: Habituation and Stimulus Discrimination in <i>Mimosa pudica</i> Explained by Mechanosensitive Channel Desensitization?」（脳なき学習: <i>Mimosa pudica</i> における馴化と刺激識別は機械受容チャネルの脱感作により説明される？）です。<br><br>会期中は、世界約70カ国・地域から集まった約1,800名のファイナリストとの交流や、各分野の専門家による英語での審査が行われ、大変有意義な国際交流の機会となりました。今回の貴重な経験を糧に、今後もさらなる研究の深化に努めてまいります。<br><br>日頃よりご支援・ご指導いただいている全ての皆様に、心より感謝申し上げます。",
                    images: getNewsImages("ISEF"),
                    link: ""
                },
                {
                    id: "mitoh-target-2026",
                    published: true,
                    date: "2026.05.29",
                    title: "2026年度 未踏ターゲット事業に採択されました",
                    summary: "IPA（独立行政法人情報処理推進機構）の2026年度未踏ターゲット事業（リザバーコンピューティング分野）に採択されました。",
                    fullContent: "IPAが実施する「2026年度未踏ターゲット事業（リザバーコンピューティング技術を活用したソフトウェア開発分野）」に採択されました。<br><br>テーマは「植物の馴化を更新則へ：オジギソウのリザバー計算的理解と計算を休むリザバー Habituation-RC（HRC）の開発」です。本プロジェクトでは、名古屋工業大学の田中剛平教授にプロジェクトマネージャー（メンター）としてご指導いただきながら、研究開発を進めます（採択金額：2,288,000円）。<br><br>今回は、私の研究テーマであるオジギソウの「馴化」現象をリザバーコンピューティングの枠組みで再解釈し、入力の定常性に応じて一部の計算を自律的にスキップする新たな動的リザバー「HRC」の開発に挑みます。計算資源の制約下で大次元の記憶容量とイベント駆動型の超低消費電力を両立させる次世代エッジAIの創出を目指します。<br><br>植物の知能と情報工学を「繋ぐ」この挑戦的なプロジェクトに全力で取り組んでまいります。",
                    images: getNewsImages("Mitou"),
                    link: "https://www.ipa.go.jp/jinzai/mitou/target/2026-reservoir/gaiyou-tg-2.html"
                },
                {
                    id: "jsai-2026",
                    published: true,
                    date: "2026.06.09",
                    title: "人工知能学会全国大会（JSAI2026）にてプレゼンテーションとパネルディスカッションに登壇",
                    summary: "人工知能学会全国大会（JSAI2026）の40周年記念企画セッション「次世代のAI for Science」にて、オジギソウ研究とAIの接点について発表し、パネルディスカッションを行いました。",
                    fullContent: "2026年6月9日に開催された人工知能学会全国大会（JSAI2026）の40周年記念企画セッション「次世代の『AI for Science』〜何を目指し、どう進めるか〜」にて、プレゼンテーションおよびパネルディスカッションに登壇しました。<br><br>プレゼンテーションでは、これまでのオジギソウを用いた実験を「AI for Science」の視点からお話しするとともに、オジギソウとAIの情報処理のアナロジー、オジギソウの情報処理からインスパイアされたAIの開発、そして高校生研究者がAIとどのように付き合っているのかについてお話ししました。<br><br>またパネルディスカッションでは、AIが発展してくる社会において次世代はどのようにAIと関わり、考えを深め、成長していけばいいのか、さらにAIとはどのような存在で、どのような時にそれに心を感じるのか、心や意識とは何かといったテーマについて、第一線でご活躍される先生方と深く議論を交わすことができ、大変貴重な経験となりました。",
                    images: getNewsImages("JSAI"),
                    link: "https://conf.ai-gakkai.or.jp/jsai2026/ks/#ks-36"
                },
                {
                    id: "neuro-2026",
                    published: true,
                    date: "2026.08.01",
                    title: "NEURO2026 高校生ポスター発表にて最優秀賞を受賞",
                    summary: "NEURO2026(第49回日本神経科学大会・第69回日本神経化学会大会・第36回日本神経回路学会大会 合同大会)の高校生ポスター発表にて最優秀賞を受賞しました。",
                    fullContent: "2026年8月1日、神戸国際会議場・神戸国際展示場で開催されたNEURO2026(第49回日本神経科学大会・第69回日本神経化学会大会・第36回日本神経回路学会大会 合同大会)の高校生ポスター発表に参加し、最優秀賞をいただきました。<br><br>今回発表したのは、「オジギソウはなぜ刺激に馴化するのか」という、長年問い続けてきたテーマについての研究です。脳を持たない植物が経験に応じて反応を変化させる仕組みを、装置とAIを用いて定量的に検証してきました。<br><br>会場では、同世代の高校生研究者から第一線で活躍される研究者の方まで、本当に多くの方とディスカッションする機会に恵まれました。特に、3年ほど前にお話しさせていただいた研究者の方が覚えていてくださり、ポスターを見にきてくださった際はとても嬉しかったです。それぞれの視点からいただいた質問やコメントは、自分ひとりでは辿り着けなかった新しい問いにつながるものばかりで、学会という場の価値を改めて実感しました。<br><br>このような機会をくださったNEURO2026運営の皆様、そして日頃から研究を支えてくださっている先生方・家族・関係者の皆様に、心より感謝申し上げます。",
                    images: getNewsImages("NEURO2026"),
                    link: "https://neuro2026.jnss.org/"
                },
                /*
                {
                    id: "-",
                    published: true,
                    date: "2025.XX.XX",
                    title: "-",
                    summary: "-",
                    fullContent: "-",
                    images: getNewsImages("-")
                }
                */
            ],
            view_more_button: "View all",
            details_button: "詳細"
        },
        research: {
            title: "Research",
            heading_grants: "研究助成・競争的資金",
            heading_awards: "研究発表・学会",
            description: "オジギソウの環境ストレスへの応答調節（馴化様応答）の検証と数理的解析を軸に、植物生理学から作物の環境適応・農業応用までを見据えた研究を進めています。ヒドラの学習など、生命に共通する情報処理の原理にも関心を広げています。",
            grants: [
                {
                    year: "2026",
                    title: "2026年度 未踏ターゲット事業(リザバーコンピューティング技術を活用したソフトウェア開発分野)",
                    details: "植物の馴化を更新則へ : オジギソウのリザバー計算的理解と計算を休むリザバー  Habituation-RC（HRC）の開発",
                    link: "https://www.ipa.go.jp/jinzai/mitou/target/2026-reservoir/gaiyou-tg-2.html",
                    featured: true
                },
                {
                    year: "2025",
                    title: "株式会社LINOA（旧株式会社ADvance Lab） 研究費",
                    details: "オジギソウにおける応答調節機構の電気生理的解明(ADvance Lab 1期生 追加研究助成金)",
                    link: "https://www.linoa-lab.co.jp/"
                },
                {
                    year: "2025",
                    title: "長野県科学振興会 研究費",
                    details: "Hydra Vulgarisにおける古典的条件付けの実証",
                    link: "http://w2.avis.ne.jp/~nkagaku/jyoseikin.html"
                },
                {
                    year: "2025",
                    title: "UTokyoGSC-NEXT (JST STELLA) 研究費",
                    details: "オジギソウにおける応答調節（馴化）の実証",
                    link: "https://gsc.iis.u-tokyo.ac.jp/",
                    featured: true
                },
                {
                    year: "2024",
                    title: "角川ドワンゴ学園 N高校研究部 研究費",
                    details: "オジギソウにおける応答調節の生態学的意義の解明",
                    link: "https://nnn.ed.jp/attractiveness/extracurricular/club/kenkyubu/"
                },
                {
                    year: "2024",
                    title: "サイエンスキャッスル研究費 価値共創賞",
                    details: "オジギソウ関連研究の計画段階における支援",
                    link: "https://www.daicel.com/news/2025/20250227_1082.html",
                },
                {
                    year: "2024",
                    title: "サイエンスキャッスル研究費 THK賞",
                    details: "オジギソウの応答調節機構のための刺激装置の開発",
                    link: "https://www.monozukuri-zero.com/science-castle/",
                    featured: true
                },
                {
                    year: "2024",
                    title: "株式会社ADvance Lab 研究費",
                    details: "ADvance Lab1期生 研究助成金",
                    link: "https://www.linoa-lab.co.jp/"
                },
                {
                    year: "2024",
                    title: "日本科学協会 研究費",
                    details: "三次元再構築の技術を用いたオジギソウの開閉度定量化",
                    link: "https://www.jss.or.jp/fukyu/mentor/",
                    featured: true
                },
            ],
            awards: [
                {
                    year: "2026",
                    title: "NEURO2026 (第49回日本神経科学大会・第69回日本神経化学会大会・第36回日本神経回路学会大会 合同大会)",
                    prize: "高校生ポスター発表 最優秀賞",
                    details: "「オジギソウはなぜ刺激に馴化するのか」というテーマで高校生ポスター発表を行い、最優秀賞を受賞しました。",
                    link: "https://neuro2026.jnss.org/",
                    featured: true
                },
                {
                    year: "2026",
                    title: "人工知能学会全国大会（JSAI2026） 40周年記念企画「AI for Science」",
                    prize: "登壇・パネリスト",
                    details: "オジギソウとAIの情報処理のアナロジーやAIを用いた研究について発表し、次世代のAIとの関わり方や心・意識について専門家とパネルディスカッションを行いました。",
                    link: "https://www.ai-gakkai.or.jp/jsai2026/",
                    featured: true
                },
                {
                    year: "2026",
                    title: "リジェネロン国際学生科学技術フェア",
                    prize: "植物科学部門 優秀賞2等 (世界2位)",
                    details: "Learning Without a Brain: Habituation and Stimulus Discrimination in Mimosa pudica Explained by Mechanosensitive Channel Desensitization?というタイトルで発表。",
                    link: "https://event.yomiuri.co.jp/jssa/",
                    featured: true
                },
                {
                    year: "2026",
                    title: "リジェネロン国際学生科学技術フェア",
                    prize: "アリゾナ州立大学賞",
                    details: "Learning Without a Brain: Habituation and Stimulus Discrimination in Mimosa pudica Explained by Mechanosensitive Channel Desensitization?というタイトルで発表。",
                    link: "https://event.yomiuri.co.jp/jssa/",
                },
                {
                    year: "2026",
                    title: "リジェネロン国際学生科学技術フェア",
                    prize: "トルコ科学技術研究会議賞 1等",
                    details: "Learning Without a Brain: Habituation and Stimulus Discrimination in Mimosa pudica Explained by Mechanosensitive Channel Desensitization?というタイトルで発表。",
                    link: "https://event.yomiuri.co.jp/jssa/",
                },
                {
                    year: "2025",
                    title: "第69回 日本学生科学賞（高等学校の部）",
                    prize: "科学技術政策担当大臣賞",
                    details: "オジギソウにおける応答調節機構の実証について発表。長野県代表として選出され、中央審査にて研究成果を披露しました。",
                    link: "https://event.yomiuri.co.jp/jssa/",
                    featured: true
                },
                {
                    year: "2025",
                    title: "サイエンスキャッスルワールド2025",
                    prize: "-",
                    details: "オジギソウの応答調節およびその機構解明について発表。オジギソウの応答調節機構について、意見を交わしました。",
                    link: "https://castle.lne.st/schedule/science-castle-world-2025/"
                },
                {
                    year: "2025",
                    title: "第48回日本分子生物学会 高校生発表",
                    prize: "-",
                    details: "オジギソウの応答調節の生態学的意義とヒドラの古典的条件付けについて発表。動物の学習との比較を通じて、学習の普遍性について専門家と議論しました。",
                    link: "https://pub.confit.atlas.jp/ja/event/mbsj2025/presentation/HS-P-34"
                },
                {
                    year: "2025",
                    title: "長野県学生科学賞(高等学校の部）",
                    prize: "県知事賞",
                    details: "オジギソウの応答調節機構に関する研究を発表。県内最高賞を受賞し、日本学生科学賞への切符を手にしました。",
                    link: "",
                    featured: true
                },
                {
                    year: "2025",
                    title: "第89回日本植物学会 高校生発表",
                    prize: "大会長賞",
                    details: "オジギソウにおける応答調節機構の実証について発表。実験系構築の独創性と実証的な成果が大会長賞として評価されました。",
                    link: "https://bsj.or.jp/jpn/general/highschool/annual.php",
                    featured: true
                },
                {
                    year: "2025",
                    title: "Joint Conference of ACMB-JSMB",
                    prize: "-",
                    details: "数理モデルを用いたオジギソウの応答調節の生態学的意義について発表。数理生物学者と構築したモデルについて議論を深めました。",
                    link: "https://pub.confit.atlas.jp/en/event/acmbjsmb2025/presentation/POS-06"
                },
                {
                    year: "2024",
                    title: "第66回 日本植物生理学会 高校生発表",
                    prize: "-",
                    details: "オジギソウの応答調節機構に関する研究構想を発表。多くの専門家から実験計画に対する有益なフィードバックを得ました。",
                    link: "https://jspp.org/"
                },
                {
                    year: "2024",
                    title: "サイエンスキャッスル2024 関東大会",
                    prize: "優秀ポスター賞",
                    details: "オジギソウの応答調節機構に関する研究構想を発表。独創的な実験系の提案と研究計画が評価されました。",
                    link: "https://lne.st/2024/12/09/s-castle2024_kanto/"
                },
                {
                    year: "2024",
                    title: "第88回 日本植物学会 高校生発表",
                    prize: "-",
                    details: "植物の記憶・学習に関する新規仮説について発表。オジギソウの馴化を証明するための研究計画について研究者と議論しました。",
                    link: "https://bsj.or.jp/"
                },
                {
                    year: "2023",
                    title: "第1回 学びの協奏コンテスト",
                    prize: "山極寿一賞",
                    details: "オジギソウの就眠運動と概日リズムに関する研究を発表。独自の視点に基づいた深い考察が高く評価されました。",
                    link: "https://steam-band.com/mnb1/finalresult/"
                },
                {
                    year: "2023",
                    title: "長野県学生科学賞(中学校の部）",
                    prize: "県知事賞 (2年連続)",
                    details: "オジギソウの就眠運動と概日リズムについて発表。継続的な観察と多角的な視点による研究の深化が評価されました。",
                    link: ""
                },
                {
                    year: "2023",
                    title: "サイエンスキャッスル2023 関東大会",
                    prize: "日本ハム賞",
                    details: "オジギソウの就眠運動と概日リズムについて発表。深層学習を用いた新規な開閉定量化手法の開発が高く評価されました。",
                    link: "https://castle.lne.st/news/26052/"
                },
                {
                    year: "2023",
                    title: "サイエンスキャッスル2023 関東大会",
                    prize: "優秀ポスター賞",
                    details: "ミドリムシの光驚動反応に関する共同研究を発表。チームでの協働成果とポスター発表の質が評価されました。",
                    link: "https://castle.lne.st/news/26052/"
                },
                {
                    year: "2022",
                    title: "長野県学生科学賞(中学校の部）",
                    prize: "県知事賞",
                    details: "オジギソウの就眠運動に関する研究を発表。緻密なデータ収集と独自の着眼点が評価され、県内最高賞を受賞しました。",
                    link: ""
                },
                {
                    year: "2021",
                    title: "長野県学生科学賞(中学校の部）",
                    prize: "優良賞",
                    details: "オジギソウの就眠運動の基礎的な観察記録を発表。粘り強い観察と科学的な探究姿勢が評価され、優良賞を受賞しました。",
                    link: ""
                },
            ],
            download_button: "PDFをダウンロード",
        },
        projects: {
            title: "Projects",
            view_all_button: "View all",
            categories: {
                foundation: { title: "Foundation (Past Projects)", period: "Past", status: "Done", color: "border-gray-500" },
                engineering: { title: "Engineering", period: "2024-2025", status: "Done", color: "border-white/40" },
                physiology: { title: "Physiology", period: "2025-", status: "Done", color: "border-white/40" },
                mechanism: { title: "Mechanism", period: "2026-", status: "Ongoing", color: "border-teal-500" },
                application: { title: "Application", period: "Present", status: "Ongoing", color: "border-teal-500" },
                vision: { title: "Vision", period: "2031-20XX", status: "Planning", color: "border-rose-500" }
            },
            items: [
                // --- Foundation ---
                {
                    id: "hydra-conditioning",
                    category: "foundation",
                    image: process.env.PUBLIC_URL + "/images/hydra.png",
                    title: "ヒドラにおける古典的条件付けの解明",
                    description: "散在神経系を持つHydra vulgarisにおける連合学習（古典的条件付け）の検証。",
                    period: "Past Project",
                    details: "脳を持たないヒドラが連合学習を示すかを検証しました。採食行動を引き起こす還元型グルタチオンと青色光、また電気刺激と青色光を繰り返し対提示し、AIを用いた行動解析により評価を行い、学習能力の進化的起源に迫りました。",
                    featured: true,
                    techStack: ["行動実験", "AI解析", "条件付け"],
                    outcomes: ["ヒドラの連合学習の可能性を検証", "散在神経系における記憶形成の起源への示唆"],
                    supports: [{ role: "協力", name: "九州大学 伊藤先生" }],
                    funding: ["長野県科学振興会 研究費"],
                },
                {
                    id: "euglena-response",
                    category: "foundation",
                    image: process.env.PUBLIC_URL + "/images/euglena.png",
                    title: "ミドリムシにおける光驚動反応の解明",
                    description: "光によって体収縮と方向転換をするミドリムシの光驚動反応の解析。",
                    period: "Past Project",
                    details: "深層学習モデルを用いてミドリムシ（Euglena gracilis）の個体追跡を行い、青色光の急激な上昇に対して遊泳速度と回転運動が激しくなる「光驚動反応」を確認しました。また振動に対する同様の反応も発見しました。",
                    featured: false,
                    techStack: ["深層学習", "個体追跡", "行動解析"],
                    outcomes: ["青色光による光驚動反応を確認", "振動に対する同調反応の発見"],
                },
                // --- Engineering ---
                {
                    id: "stimulator",
                    category: "engineering",
                    image: process.env.PUBLIC_URL + "/images/stimulation-device.png",
                    title: "全方位刺激装置の開発",
                    description: "オジギソウに統制された刺激を与えるための独自の全方位刺激装置を開発。",
                    period: "2024-2025",
                    details: "オジギソウの刺激に対する応答を定量的に評価するため、前後左右や上下から精密にコントロールされた刺激を与えることができる全方位刺激装置を独自に開発しました。これにより、刺激の方向や強度に応じたオジギソウの応答の関係性を定量的に評価することが可能になりました。",
                    featured: false,
                    techStack: ["3Dプリンタ", "制御工学", "Raspberry pi"],
                    outcomes: ["任意の方向から精密に刺激を与えられる装置の開発に成功", "定量的な応答評価基盤の確立"],
                    supports: [{ role: "協力", name: "株式会社 THK 原子内様" }],
                    funding: ["株式会社 THK"]
                },
                {
                    id: "leaf-quantification",
                    category: "engineering",
                    image: process.env.PUBLIC_URL + "/images/detect.png",
                    title: "葉開閉度定量化システムの開発",
                    description: "深層学習を用いたオジギソウの葉開閉度の定量的解析システムを構築。",
                    period: "2024-2025",
                    details: "目視や単純な計測に頼っていた植物の挙動を高精度な定量データとして捉え直すため、AI（YOLOv9やConvNeXtなど）を用いた画像解析技術を活用し、オジギソウの葉の開度を連続的かつ定量的に評価するシステムを構築しました。",
                    featured: false,
                    techStack: ["YOLOv9", "ConvNeXt", "深層学習", "Python"],
                    outcomes: ["植物の挙動を連続的な定量データとして評価することに成功", "解析プロセスの完全自動化を実現"],
                    mentor: [{ role: "メンター", name: "九州大学 野下先生" }],
                    funding: ["日本科学協会"],
                },
                // --- Physiology ---
                {
                    id: "mimosa-habituation",
                    category: "physiology",
                    image: process.env.PUBLIC_URL + "/images/mimosa_hab.jpg",
                    title: "馴化様応答の検証：オジギソウは刺激を識別し、選択的に応答を調節するか",
                    description: "オジギソウが反復刺激に対して応答を減弱させる「馴化様応答」を示すことを、独自開発のシステムで定量的に観察・検討。",
                    period: "2025",
                    details: "独自開発の刺激装置と開閉度定量化技術を組み合わせ、オジギソウが反復刺激に対して応答を減弱させる「馴化様応答」を示すことを定量的に観察・検討しました。応答の減弱を「学習」とみなせるのか、それともより単純な生理的疲労によるものなのか——馴化研究に古くからあるこの論点（Gagliano et al. 2014 とその再現性をめぐる議論）に、定量的な手法で向き合うことを大切にしています。",
                    featured: true,
                    techStack: ["馴化様応答", "基底的認知", "定量解析"],
                    outcomes: ["オジギソウが馴化様応答を示すことを定量的に観察", "植物の基底的な情報処理（馴化様応答）に関する行動学的データの提示"],
                    mentor: [{ role: "メンター", name: "東京大学 末次先生" }],
                    funding: ["UTokyoGSC-Next (JST STELLA)"],
                },
                {
                    id: "ecological-habituation",
                    category: "physiology",
                    subProject: true,
                    image: process.env.PUBLIC_URL + "/images/ecological.png",
                    title: "馴化様応答の生態学的意義（Sub Project）",
                    description: "オジギソウの「馴化様応答」がエネルギー収支に与える影響を数理モデルを用いて解析。",
                    period: "2025",
                    details: "オジギソウの「馴化様応答」が持ちうる生存上の利点を評価するため、葉の開閉に伴うエネルギーコストと食害リスクのトレードオフを考慮した数理モデルを構築し、異なる生存戦略間での優位性を定量的に検討しました。このエネルギーコストと防御のトレードオフという視点は、限られた資源のなかで環境ストレスや食害にいかに適応するかという、作物の環境適応戦略や耐性育種にも通じる普遍的な問いだと考えています。",
                    featured: false,
                    techStack: ["数理モデル化", "シミュレーション", "生態学"],
                    outcomes: ["エネルギーコストと食害リスクのトレードオフをモデル化", "馴化様応答がもたらしうる生存上の利点を数理モデルにより定量的に評価"],
                    mentor: [{ role: "メンター", name: "埼玉医科大学 別所先生" }],
                    funding: ["N高校研究部"],
                },
                // --- Mechanism ---
                {
                    id: "math-modeling",
                    category: "mechanism",
                    image: process.env.PUBLIC_URL + "/images/mechanism-vivo.png",
                    title: "馴化様応答の数理モデル化",
                    description: "局所的脱感作仮説に基づく、オジギソウの「馴化様応答」の数学的解明。",
                    period: "2026-Present",
                    details: "オジギソウが刺激情報を「識別・保持・選択」しているように見える仕組みに迫るため、細胞の局所的な脱感作をモデル化する数理的なアプローチから、馴化様応答を支えると考えられるメカニズムを記述・検証しようとしています。",
                    featured: false,
                    techStack: ["数理生物学", "微分方程式", "Python"],
                    outcomes: ["局所的脱感作仮説に基づく数理モデルの構築", "馴化様応答のメカニズムに関する理論的基盤の構築（進行中）"],
                    mentor: [{ role: "メンター", name: "埼玉医科大学 別所先生" }],
                    funding: [],
                },
                {
                    id: "molecular-basis",
                    category: "mechanism",
                    image: process.env.PUBLIC_URL + "/images/mechanism-invitro.png",
                    title: "馴化様応答の分子基盤",
                    description: "カルシウムイメージング技術を用いた局所的脱感作仮説の検証。",
                    period: "2026-Present",
                    details: "数理モデルで予測された細胞の局所的な脱感作を、ゲノム編集によりGCaMPを発現するオジギソウを用いたカルシウムイメージング実験によって検証します。細胞内シグナル伝達を可視化し、分子レベルでの馴化様応答の仕組みに迫ります。",
                    featured: false,
                    techStack: ["カルシウムイメージング", "細胞生物学", "分子生物学"],
                    outcomes: ["数理モデルの予測を生物学的に検証する実験系の確立", "細胞レベルでの馴化メカニズムの可視化"],
                    funding: [],
                    supports: [{ role: "協力", name: "埼玉大学 豊田研究室" }],
                },
                // --- Application ---
                {
                    id: "hrc",
                    category: "application",
                    image: process.env.PUBLIC_URL + "/images/hrc.png",
                    title: "Habituation Reservoir Computing (HRC) の開発",
                    description: "オジギソウの「馴化」に着想を得た効率的な時系列情報処理アルゴリズムの開発。",
                    period: "2026-Present",
                    details: "脳や神経系を持たないオジギソウが刺激に「慣れる」プロセスを数学的にモデル化し、ニューラルネットワークの一種であるリザバーコンピューティング(RC)の更新則へと応用します。これにより、必要な時だけ計算を行う省電力で自律的な新計算モデル「Habituation-RC（HRC）」の構築を目指します。",
                    featured: true,
                    techStack: ["リザバーコンピューティング", "ニューラルネットワーク", "数理最適化"],
                    outcomes: ["バイオインスパイアードAIの提案", "省電力で自律的な新計算モデル『HRC』の設計"],
                    mentor: [{ role: "PM (メンター)", name: "名古屋工業大学 田中先生" }],
                    funding: ["IPA 2026年度未踏ターゲット事業"],
                },
                {
                    id: "physical-reservoir",
                    category: "application",
                    image: process.env.PUBLIC_URL + "/images/mimosa-rc.png",
                    title: "物理リザバーとしてのオジギソウの情報処理機能の実証",
                    description: "オジギソウ自体が「事前学習済み」の物理リザバーモデルとして機能するかを検証。",
                    period: "2026-Present",
                    details: "自然界の植物が持つ情報処理能力を、物理リザバー計算の枠組みで評価します。オジギソウが環境から受け取った刺激をいかにして計算しているかを実証し、AIの情報処理とのアナロジーを調べます",
                    featured: false,
                    techStack: ["物理リザバー計算", "情報理論", "生体計測"],
                    outcomes: ["植物自体を計算資源として活用する概念の実証", "AIの情報処理とのアナロジーの解明"],
                    mentor: [{ role: "PM (メンター)", name: "名古屋工業大学 田中先生" }],
                    funding: ["IPA 2026年度未踏ターゲット事業"],
                },
                {
                    id: "stress-crop",
                    category: "application",
                    image: process.env.PUBLIC_URL + "/images/crop.png",
                    title: "馴化を利用した環境ストレス耐性作物の開発",
                    description: "気候変動下の食料生産を支えるため、馴化の知見を作物の環境ストレス耐性へ応用。",
                    period: "2026-Present",
                    details: "オジギソウの馴化研究で得た「植物が環境刺激を識別し、応答を最適化する」という知見を、乾燥・高温・食害といった環境ストレスへの耐性という観点から作物へ展開します。過剰な防御応答による生育コストを抑えつつ、必要なときにだけ適切に応答する——そんな環境適応能力の高い次世代作物の育種基盤を築き、気候変動が進む世界での食料生産のレジリエンス向上に貢献することを目指す、農学の応用プロジェクトです。",
                    featured: false,
                    techStack: ["作物学", "植物生理学", "環境ストレス耐性育種"],
                    outcomes: ["馴化メカニズムの作物・農業応用への展開", "環境適応能力の高い次世代作物の育種基盤の構築"],
                    mentor: [],
                    funding: [],
                },
                // --- Vision ---
                {
                    id: "universal-intelligence",
                    category: "vision",
                    image: process.env.PUBLIC_URL + "/images/intelligence.png",
                    title: "基盤を超えた知能の普遍的原理を問う",
                    description: "脳の有無やハードウェアの違いを超えて、情報処理に共通する原理がありうるかを問う。",
                    period: "2028-20XX",
                    details: "本プロジェクトが問いたいのは、動物の神経系、植物の分散的なネットワーク、そして人工知能（シリコン基質）といった異なる基盤の情報処理に、共通する原理がありうるのか、ということです。統合情報理論やリザバーコンピューティングといった枠組みを、答えではなく探索の道具として用いながら、知能の定義そのものを問い直していきます。そしてこの探究は、脳を持たない植物が過酷な環境を生き抜く戦略の理解へと還元され、気候変動下でも安定して実る作物の育種や持続可能な食料生産という、人類の食を支える農学の課題への貢献にもつながると考えています。",
                    featured: true,
                    techStack: ["基底的認知", "複雑系科学", "システム論"],
                    outcomes: ["多様なシステムに共通する情報処理の枠組みの探索（今後の目標）", "知能の定義を問い直すための理論的枠組みの構築（今後の目標）"],
                    mentor: [],
                    funding: [],
                },
                // --- Outreach ---
                {
                    id: "advancelab-vice",
                    category: "outreach",
                    image: process.env.PUBLIC_URL + "/images/advancelab.png",
                    title: "ADvance Lab 副所長",
                    description: "中高大学生の研究コミュニティの運営と、新たな価値創造の場の構築。",
                    period: "Past Role",
                    details: "ADvance Labという団体で副所長を歴任しました。中学生・高校生・大学生が学年や分野の垣根を越えて集い、活発に議論や共同研究を行えるコミュニティの形成に尽力しました。若手研究者同士のネットワーク構築を通じて、次世代の科学コミュニティにおける価値創造に貢献しました。",
                    featured: false,
                    techStack: ["コミュニティ運営", "メンタリング", "組織マネジメント"],
                    outcomes: ["異分野の学生が交流する研究コミュニティの形成", "若手研究者による新たな価値創造の場の提供"],
                    mentor: [],
                    funding: [],
                    role: "副所長",
                },
                {
                    id: "science-outreach",
                    category: "outreach",
                    image: process.env.PUBLIC_URL + "/images/science.png",
                    title: "サイエンス出前便（Outreach）",
                    description: "地方と都市部の教育格差を是正し、子供たちが科学に触れ合う機会を増やすため科学教室を企画。",
                    period: "2024.11 - Present",
                    details: "自身の経験から地方における科学教育の機会格差に問題意識を持ち、立ち上げたプロジェクトです。長野県内の小学生を対象に、身近な自然をテーマにした科学教室を企画・運営。観察や実験を通じて、子どもたちの知的好奇心を引き出し、科学の面白さを伝える活動を継続的に行っています。",
                    featured: true,
                    techStack: ["科学教育", "イベント企画", "コミュニケーション"],
                    outcomes: ["長野県内の小学生向けに多数の科学教室を実施", "地方の教育格差是正への草の根的な貢献"],
                    mentor: [],
                    funding: [],
                    role: "企画・運営代表",
                }
            ]
        },
        map: {
            title: "Global Activity Map",
            description: "知の拠点は世界へ広がる",
            locations: [
                { id: "nagano", name: "長野県 (拠点)", x: 79.6, y: 49.5, image: process.env.PUBLIC_URL + "/images/mimosa_hab.jpg", details: "私の活動の拠点であり、原点。ここから世界へ、知のネットワークを広げています。" },
                { id: "san-francisco", name: "アメリカ サンフランシスコ", x: 17, y: 48, image: process.env.PUBLIC_URL + "/images/san.jpg", details: "「ながの視察団 AOKI咸臨丸」の一員として訪問。1週間の滞在期間中、ベンチャーキャピタルや元駐日大使との面談など、貴重な経験を積みました。" },
                { id: "utah", name: "アメリカ ユタ州", x: 20, y: 47, image: process.env.PUBLIC_URL + "/images/utah.png", details: "小学5年生の時、1ヶ月間のホームステイを経験。初めての海外で大きなカルチャーショックを受け、国際的な視野を広げるきっかけとなりました。" },
                { id: "shanghai", name: "中国 上海", x: 75, y: 52, image: process.env.PUBLIC_URL + "/images/shanghai.jpg", details: "中学3年生の時、2週間の学校寮滞在を経験。現地の有名観光地を訪れると共に、学校の授業に参加し、文化交流を深めました。" },
                { id: "singapore", name: "シンガポール", x: 71.5, y: 65.7, image: process.env.PUBLIC_URL + "/images/singapore.png", details: "中学3年生の時、2週間のホームステイを経験。ムスリムのホストファミリーとの交流を通じて、文化的な違いを乗り越え、互いの理解を深めました。" },
                { id: "thailand", name: "タイ", x: 71, y: 60, image: process.env.PUBLIC_URL + "/images/asc2025.png", details: "「Asian Science Camp 2025」に日本代表団の一員として参加。アジア各国から集まった学生やノーベル賞受賞者と交流し、科学的な議論を通じて国際的な視点と人的な繋がりを深めました。" },
                { id: "phoenix", name: "アメリカ フェニックス", x: 20, y: 50, image: process.env.PUBLIC_URL + "/images/ISEF2026.jpg", details: "「Regeneron ISEF2026」に日本代表団の一員として参加。植物部門において発表を行い3つの賞を受賞したほか、各国からの参加者と交流しました。" }
            ]
        },
        activities: {
            title: "Activities & Involvements",
            site_button: "公式サイト",
            items: [
                { id: "gci", image: process.env.PUBLIC_URL + "/images/Matsuo2.png", year: "2025", title: "松尾研 GCI", event: "受講生", details: "東京大学松尾研究室主催のデータサイエンス講座にて、Pythonを用いたデータ解析や機械学習の実装を体系的に習得。コンペティション形式の課題を通じて実践力を磨き、現在の研究における実験データの定量化や解析基盤を確立しました。", link: "https://weblab.t.u-tokyo.ac.jp/news/gci-2025-summer-%e3%81%ae%e5%8b%9f%e9%9b%86%e9%96%8b%e5%a7%8b/" },
                { id: "llm", image: process.env.PUBLIC_URL + "/images/Matsuo1.png", year: "2025", title: "松尾研 LLM", event: "受講生", details: "大規模言語モデル（LLM）の仕組みや応用技術について、最先端の工学的知見を学習。生成AIのアーキテクチャへの理解を深め、科学研究プロセスへのAI導入や、生物学と情報学を繋ぐ新たなアプローチを模索する契機となりました。", link: "https://weblab.t.u-tokyo.ac.jp/large-language-model/" },
                { id: "stanford-entrepreneur", image: process.env.PUBLIC_URL + "/images/SPICE_entre.png", year: "2024-2025", title: "Stanford e-Entrepreneurship", event: "受講生", details: "スタンフォード大学の講師陣によるオンライン講義を通じて、起業家精神やビジネスプランニングの基礎を学びました。最終的には、教育格差問題に取り組むためのプロジェクトをチームで立案し、英語で発表しました。", link: "https://spice.fsi.stanford.edu/fellowship/stanford-e-entrepreneurship-japan" },
                { id: "stanford-japan", image: process.env.PUBLIC_URL + "/images/SPICE.png", year: "2025", title: "Stanford e-Japan", event: "受講生", details: "日米関係の専門家による講義を受け、外交、文化、経済など多角的な視点から日米関係について学びました。他の参加者との英語でのディスカッションを通じて、国際的な視野と議論のスキルを深めました。", link: "https://spice.fsi.stanford.edu/fellowship/stanford-e-japan" },
                { id: "n1-dojo", image: process.env.PUBLIC_URL + "/images/n1.png", year: "2024-2025", title: "エヌイチ道場", event: "5期生", details: "自身の「サイエンス出前便」プロジェクトを事業として発展させるため、メンターの指導のもと、事業計画の策定、ターゲット顧客の分析、収益モデルの検討など、実践的な起業プロセスを学びました。", link: "https://www.sunaba.org/n1dojo" },
                { id: "gsc-next", image: process.env.PUBLIC_URL + "/images/UTokyo.jpg", year: "2024-", title: "UTokyoGSC-NEXT", event: "6期生", details: "東京大学の教授陣から最先端の科学技術に関する講義を受け、自身の研究テーマを深める機会を得ました。全国から集まった意欲の高い同世代の仲間と交流し、大きな刺激を受けています。", link: "https://gsc.iis.u-tokyo.ac.jp/" },
                { id: "advancelab", image: process.env.PUBLIC_URL + "/images/advancelab.png", year: "2024-", title: "ADvance Lab", event: "副所長", details: "現在は副所長として、ラボの運営にも関わっています。次世代と企業をつなぎ新たな価値を創造するとともに、地方におけるイベントなども企画し研究の輪を広げています。", link: "https://adlab.lne.st/" },
                { id: "aoki-kanrinmaru", image: process.env.PUBLIC_URL + "/images/aoki.png", year: "2022-2023", title: "ながの視察団 AOKI咸臨丸", event: "7期生", details: "中学生の時に参加したこのプログラムが、現在の活動の原点の一つです。シリコンバレーでの研修では、失敗を恐れずに挑戦する文化に触れ、自身の行動指針に大きな影響を受けました。", link: "https://aoki-zaidan.or.jp/srv_kanrin.php" },
                { id: "tsukuba-skip", image: process.env.PUBLIC_URL + "/images/Tsukuba.png", year: "2021-2022", title: "つくば SKIP Academy", event: "受講生", details: "オンラインで大学レベルの数学や物理学に触れることで、科学研究に必要な論理的思考の基礎を固めました。この時の経験が、現在の研究で数理モデルを扱う上での助けとなっています。", link: "https://skip.tsukuba.ac.jp/" },

            ]
        },
        insights: {
            title: "Insights",
            description: "日々の研究や活動の中で感じた、小さな気づきや学びの記録。\n※ラフに書いているため文章がMessyです。",
            view_more_button: "View all",
            items: [
                {
                    id: "data-and-emotion",
                    date: "2026.03.14",
                    title: "量子とオジギソウ",
                    summary: "知覚できない現象を解釈し、意味づけすることの重要性について。",
                    content: "東京都現代美術館の「ミッション∞インフィニティ｜宇宙＋量子＋芸術」を訪問した際に、もうひとつの気づきがあった。\n\n量子展では、量子のもつれや測定といった人間が直接知覚することのできない現象を、それぞれの美的感覚に基づいて解釈・意味付けしていくプロセスが展示の核心にあった。このプロセスは、私が取り組むオジギソウの研究と本質的に似ていると感じた。\n\nオジギソウの内部状態——たとえば運動細胞のイオン量やMSLチャネルの脱感作の程度——はセンサーを用いて計測・評価することができる。しかしそのデータは、そのままでは人間にとって何の意味も持たない。知覚不可能な現象を数値として取り出せても、それだけでは伝わらないという点において、量子の特性と構造的に同じである。\n\nそのような文脈で、私はオジギソウの馴化現象をはじめとする植物の情報処理の美しさや面白さを、単なるデータの提示にとどまらず、現象を解釈・意味付けすることで情動に直接訴えかけるような展示として伝えてみたいと、強く感じた。",
                    tags: ["研究哲学", "芸術", "科学"],
                    images: [],
                    link: ""
                },
                {
                    id: "embracing-unknown",
                    date: "2026.03.14",
                    title: "芸術と科学の連続性について",
                    summary: "科学も芸術も、『世界の見え方を提示する取り組み』という点で本質的に同一である。",
                    content: "先日、東京都現代美術館で開催されている「ミッション∞インフィニティ｜宇宙＋量子＋芸術」を訪問した。量子技術や宇宙開発における知見を、芸術的文脈で再定義し表現するという試みの展覧会である。この観覧を通して、科学と芸術の繋がりについて興味深い示唆を得た。\n\n科学も芸術も、「世界の見え方を提示する取り組み」という点で本質的に同一である。\n\nどちらも世界を表面的に捉えるのではなく、その裏側に存在する秩序や構造、連続性、法則を記述しようと試みている。科学がそれを「再現可能な形」に落とし込むのに対し、芸術は「知覚可能な形」に落とし込むという手法の違いはある。しかし、未知のものに対して問いを立て、見えにくい本質をすくい上げようとする姿勢には、深い連続性がある。いずれの営みも、複雑でカオスな世界に対して自ら「問い」を立てることから始まり、無数にある情報の中からノイズを削ぎ落とし、見えにくい本質だけをすくい上げる——すなわち抽象化する——プロセスを経るものである。\n実際、これまで多くの芸術家や科学者が世界の見え方を変えてきた。芸術においては印象派やキュビズム、科学においては地動説や遺伝子の発見など、その例を挙げればきりがない。\n\n昨年訪問した金沢21世紀美術館では、植物の知能（オジギソウの馴化など）を研究するステファノ・マンクーゾによる展示が行われていた。近年、このように研究者が美術館で展示を行うケースが増えている。これは単なる偶然ではなく、研究者の求めるものと芸術家の求めるものが、美術館という空間で合致しているからだと考える。\n\n科学者側には、研究活動の中で発見した事象の「情動に訴えかけるような美しさ」を、人々の感性に直接伝えたいというニーズがある。実験を通じて感じた生物の生命力、カオスに見える現象の中に潜む秩序。そういったものを見つけたときの感動は並一通りのものではない。私自身も、オジギソウの運動や、研究を通じて発見した種を超えた機構の連続性などに、何度感動したかわからない。しかしそれを、論文や学会発表という厳格なフォーマットのもとで伝えていくことは難しい。研究者が感じた美しさは研究の本質的な部分であると思うが、研究の客観性や信頼性を担保するために、個人の主観的な情動は論文や発表から排除されるべきでもある。そのため研究者が、文字や画像といったメディアや論文・学会発表という硬い枠組みを超え、より自由に情動へ直接訴えかける形でその美しさを伝えたいと考えるのは、自然なことである。\n\n一方、芸術家側のニーズとしては、現代の世界を解釈するための最先端の素材を求めているのだと考える。芸術家は、研究者が抽出したデータや法則性の奥に潜む哲学的な意味を見出し、それを社会の文脈へと接続する役割を担おうとしている。\n\n両者のニーズが交差する場において、客観的なデータは主観的な体験へと翻訳される。研究と芸術が融合した展示は、生命や宇宙の真理を誰もが知覚できる形で社会に共有するための、最も有効な手段のひとつとなっている。",
                    tags: ["研究哲学", "芸術", "科学"],
                    images: [],
                    link: "https://hemokosa.com/QCA/QCAbook.pdf"
                },
                {
                    id: "distributed-intelligence",
                    date: "2026.03.14",
                    title: "音楽は複雑系だ",
                    summary: "音楽がひとつの巨大な「複雑系」として機能していることに気づいた。",
                    content: "先日、サントリーホールで日本フィルハーモニー交響楽団によるサミー・ムサ作曲の『Elysium（エリュシオン）』（2022年）を聴いた。これまで私は、クラシック音楽によって心から感動したことはなかった。しかし、今回の体験は私の認識を変えた。\n\n演奏が始まると、不協和音にも聞こえる微細な「音の雲」が連続的に変化し、ホールに響く。それは単なる不協和音ではなく、大自然の雄大さや、生命がダイナミックに移ろいゆくプロセスを表現しているかのような美しさがあった。\n\nなぜ、これほどまでに惹きつけられたのか。それは、この音楽がひとつの巨大な「複雑系」として機能していたからだと思う。楽譜というミクロで厳密なアルゴリズムに従い、数十人の奏者が特定の周波数とリズムを刻む（ただそこには意図されたものも意図されてないものも含め微細なずれがある）。放たれた音波は空間で非線形に干渉し、予測可能だったはずの足し算の限界を突破して、「生命のうねり」をマクロな次元で作り出す。\n\nとても面白いと思った。研究してみたい。",
                    tags: ["研究哲学", "複雑系"],
                    images: [],
                    link: "https://www.youtube.com/watch?v=cpaRD_ZWzTg&list=RDcpaRD_ZWzTg&start_radio=1"
                },
                {
                    id: "rural-to-global",
                    date: "2026.03.05",
                    title: "地方から世界へ：距離は壁じゃない",
                    summary: "長野にいることはハンデではなく、むしろアドバンテージ。",
                    content: "長野という地方で研究をしていると、東京や海外の研究者との連携や学会参加、研究リソースの不足に不便を感じることもある。でも、オンラインツールやSNSの発達により、物理的な距離はもはや本質的な障壁ではなりつつある。地方にいることはハンデではなく、自分の視点をユニークにしてくれる明確なアドバンテージ。",
                    tags: ["地方"],
                    images: [],
                    link: ""
                },
                {
                    id: "science-for-kids",
                    date: "2025.01.20",
                    title: "子どもたちの『なぜ？』に救われる",
                    summary: "サイエンス出前便で出会った純粋な好奇心が、研究の原点を思い出させてくれた。",
                    content: "先日のサイエンス出前便で、小学2年生の女の子が『オジギソウはなんで夜になると葉っぱを閉じるの？』と聞いてきた。よく知っているなぁと感動した。学術的には概日リズムの話になるのだけど、自分もかつて同じような疑問を持って、オジギソウを見ていたことを思い出した。研究が高度になるほど、その原初的な『なぜ？』から離れがち。でも、あの問いこそが全ての出発点だった。子どもたちに教えているつもりが、実は自分が一番大切なことを教わっている。",
                    tags: ["教育"],
                    images: [],
                    link: ""
                },
            ]
        },
        media: {
            title: "Media",
            items: [
                {
                    date: "2026.05.25",
                    mediaName: "読売新聞 (全国版 / オンライン)",
                    title: "日本学生科学賞の３研究　優秀賞　国際学生科学技術フェア",
                    link: "https://www.yomiuri.co.jp/science/20260524-GYT8T00095",
                    image: "",
                    type: "newspaper | Web news",
                    description: "読売新聞の朝刊（全国版）および読売新聞オンラインにて、日本学生科学賞受賞者の代表として、ISEF（国際学生科学技術フェア）での受賞の様子が紹介されました。",
                },
                {
                    date: "2026.05.21",
                    mediaName: "TBS",
                    title: "日本学生科学賞受賞と研究内容に関する報道",
                    link: "https://vt.tiktok.com/ZSxARN8Mv/",
                    image: getMediaImage("TBS"),
                    type: "TV",
                    description: "TBSの朝の情報番組The timeの「全国中高生ニュース」において、日本学生科学賞における科学技術政策担当大臣賞受賞とその研究内容に関して報道されました。",
                },
                {
                    date: "2026.05.17",
                    mediaName: "読売新聞 (全国版) / 各種メディア",
                    title: "世界大会「Regeneron ISEF 2026」優秀賞2等＆特別賞受賞に関する報道",
                    link: "https://www.itmedia.co.jp/news/articles/2605/18/news123.html",
                    image: "",
                    type: "newspaper | Web news",
                    description: "世界最大の学生科学フェア「ISEF 2026」にて、植物科学部門優秀賞2等、および特別賞2つを受賞したことが報道されました。",
                },
                {
                    date: "2026.03.26",
                    mediaName: "読売新聞 (地方版)",
                    title: "第69回日本学生科学賞受賞に関する報道（科学技術政策担当大臣賞）",
                    link: "",
                    image: "",
                    type: "newspaper",
                    description: "日本学生科学賞における「科学技術政策担当大臣賞」の受賞と、ISEF日本代表選出について報じられました。",
                },
                {
                    date: "2026.1.25",
                    mediaName: "長野日報",
                    title: "長野県学生科学賞 県知事賞受賞に関する報道",
                    link: "https://www.nagano-np.co.jp/news/detail.php?id=5159",
                    image: "",
                    type: "newspaper",
                    description: "オジギソウの馴化様現象を独自に開発した画像解析システムで解明した成果により、最高賞の長野県知事賞を受賞した際の報道。",
                },
                {
                    date: "2026.1.25",
                    mediaName: "信州・市民新聞",
                    title: "長野県学生科学賞 県知事賞受賞に関する報道",
                    link: "https://www.shimin.co.jp/archives/12214",
                    image: "",
                    type: "newspaper",
                    description: "オジギソウの馴化様現象を独自に開発した画像解析システムで解明した成果により、最高賞の長野県知事賞を受賞した際の報道。",
                },
                {
                    date: "2025.12.20",
                    mediaName: "読売新聞 (全国版)",
                    title: "第69回日本学生科学賞受賞に関する報道（科学技術政策担当大臣賞）",
                    link: "",
                    image: "",
                    type: "newspaper",
                    description: "日本学生科学賞における「科学技術政策担当大臣賞」の受賞と、ISEF日本代表選出について報じられました。",
                },
                {
                    date: "2025.12.17",
                    mediaName: "イクジィ (ikuzy)",
                    title: "高校生が子どもたちに伝える“科学のときめき” –––– サイエンス出前便の挑戦",
                    link: "https://ikuzy.com/babykids/%e9%ab%98%e6%a0%a1%e7%94%9f%e3%81%8c%e5%ad%90%e3%81%a9%e3%82%82%e3%81%9f%e3%81%a1%e3%81%ab%e4%bc%9d%e3%81%88%e3%82%8b%e7%a7%91%e5%ad%a6%e3%81%ae%e3%81%a8%e3%81%8d%e3%82%81%e3%81%8d/",
                    image: "",
                    type: "web",
                    description: "「イオンモール松本×イクジィ」のコラボイベントにおいて、小学生向けに科学工作教室を実施した諏訪清陵高校の有志チーム「サイエンス出前便」の取り組みやインタビューが掲載されました。",
                },
                {
                    date: "2025.11.22",
                    mediaName: "読売新聞 (地方版)",
                    title: "長野県学生科学賞受賞に関する報道（県知事賞）",
                    link: "",
                    image: "",
                    type: "newspaper",
                    description: "長野県学生科学賞における最高賞の県知事賞を受賞したことについて報じられました。",
                },
                {
                    date: "2025.10.12",
                    mediaName: "Steenz",
                    title: "オジギソウは“記憶する”？地元・長野からオジギソウ研究と教育普及に熱中する高校生【小松和滉・17歳】",
                    link: "https://steenz.jp/48492/",
                    image: getMediaImage("steenz-25-10"),
                    type: "interview",
                    description: "10代の活動を紹介するメディア「Steenz」のインタビューにおいて、オジギソウに関する研究や、地方と都会の教育格差に対する想いを語りました。",
                },
                {
                    date: "2024.12.28",
                    mediaName: "長野日報",
                    title: "清陵高生が講師に　冬休みの児童に科学教室",
                    link: "https://www.nagano-np.co.jp/news/detail.php?id=2870",
                    image: getMediaImage("nippo-24-12"),
                    type: "newspaper",
                    description: "諏訪清陵高校の生徒が講師となり、冬休み期間中の小学生を対象に紙飛行機の実験を通じた科学教室を開催したことが報じられました。",
                },
                {
                    date: "2024.12.28",
                    mediaName: "NHK (地方版）",
                    title: "清陵高生が講師に　冬休みの児童に科学教室",
                    link: "https://www.nagano-np.co.jp/news/detail.php?id=2870",
                    image: getMediaImage("NHK-24-12"),
                    type: "TV",
                    description: "諏訪清陵高校の生徒が講師となり、冬休み期間中の小学生を対象に紙飛行機の実験を通じた科学教室を開催したことが報じられました。",
                },

            ]
        },
        contact: {
            title: "Connect",
            description: "あらゆる境界を超えて、新たな「繋がり」を築きましょう。",
            email: "koma1667@outlook.jp"
        },
        footer: {
            columns: [
                { title: "Explore", items: ["Profile", "Vision", "News", "Research", "Projects", "Map", "Insights", "Media"] },
                { title: "Activities", items: ["Activities", "ADvance Lab"] },
                { title: "Connect", items: ["Contact", "X (Twitter)", "Instagram", "Facebook", "LinkedIn", "GitHub"] }
            ]
        },
        all_news_page: {
            title: "すべてのニュース",
            back_button: "戻る"
        },
        all_projects_page: {
            title: "すべてのプロジェクト",
            back_button: "戻る"
        }
    },
    en: {
        nav: { profile: "Profile", vision: "Vision", news: "News", research: "Research", projects: "Projects", map: "Map", insights: "Insights", activities: "Activities", media: "Media", contact: "Contact" },
        ui: {
            read_more: "Read more",
            click_for_details: "Click for details",
            featured_project: "Featured project",
            back: "Back",
            award_label: "Award",
            grant_label: "Grant",
            copy: "Copy email",
            click_to_copy: "Click to Copy",
            copied: "Copied",
            view: "View",
            designed_with: "Designed with Botanical Intelligence.",
            back_to_main: "Back to Main Page",
            scroll: "Scroll",
            view_website: "View related info",
            view_all_insights: "View all",
            insight_details: "Details",
            all: "All"
        },
        hero: {
            title: "Intelligence is Connection",
            subtitle: "The Rhizome of Intelligence",
            name_label: "Kazuhiro Komatsu | Student"
        },
        profile: {
            title: "Profile",
            name: "Kazuhiro Komatsu",
            affiliation: "Suwa Seiryo High School",
            description: "I believe that new 'intelligence' is born precisely when different fields connect.\n\nBased in Nagano, I research the environmental stress responses (habituation) of Mimosa pudica from the interdisciplinary perspective of 'Biology × Informatics,' while also leading science education initiatives to bridge the educational gap between rural and urban areas. How does a plant with no brain sense changes in its environment and optimize its responses? I believe unraveling this mechanism connects to the breeding of crops that yield reliably even in a changing climate, and to sustainable food production—challenges at the very heart of agricultural science.\nConnecting laboratory insights with social issues, and cutting-edge technology with children in rural regions. By acting as a 'bridge' that smoothly connects these often divided worlds, I aim to unlock new possibilities.",
            cv_button: "View CV"
        },
        vision: {
            title: "Vision",
            heading: "Rethinking Intelligence",
            description: "Is intelligence something reserved only for animals with brains and nervous systems? I want to question this very premise.\n\nWithout a central brain, Mimosa pudica responds to stimuli through a distributed network spread across its whole body, showing habituation-like behavior. Phenomena like this resonate with the questions raised by frameworks such as Integrated Information Theory and basal cognition—whether intelligence might be found not in a specific organ, but on the side of the system, in the interaction of its elements. Of course, I do not claim that plants possess consciousness or emotions, and whether the observed decline in response reflects 'learning' or a simpler physiological process remains an open question. That is precisely why I want to accumulate evidence rather than assert conclusions, and examine—both empirically and theoretically—whether there might be principles of information processing common to all life.\n\nAnd understanding how brainless plants adapt to environmental stress is not only about approaching the riddle of intelligence. I am convinced it also connects to the challenges of agriculture—breeding crops that yield reliably even in a changing climate, and sustainable food production—and I hope to return the knowledge gained from basic research to supporting humanity's food and farming.",
        },
        news: {
            title: "News",
            items: [
                {
                    id: "new-website",
                    published: true,
                    date: "July 15, 2025",
                    title: "Major Portfolio Site Renewal",
                    summary: "Refreshed the website with the concept of 'The Rhizome of Intelligence'.",
                    fullContent: "Today, I've launched a major renewal of my portfolio site. Based on the concept 'The Rhizome of Intelligence,' it visually expresses the combination of plant networks and AI. Please see how my past, present, and future activities connect organically.<br><br><a href='https://sites.google.com/view/kazuhirokomatsu' target='_blank' rel='noopener noreferrer' class='text-[#a7b08f] hover:underline'>Previous Site</a>",
                    images: getNewsImages("new_website")
                },
                {
                    id: "nagano-gakkasyo2025",
                    published: true,
                    date: "Oct 4, 2025",
                    title: "Governor's Prize at Nagano Prefecture Student Science Award",
                    summary: "Received the top award for research elucidating the 'habituation-like' phenomenon in Mimosa pudica using image analysis technology.",
                    fullContent: "In October 2025, my research project received the 'Governor's Prize,' the highest award, at the Nagano Prefecture Student Science Award judging session.<br><br>The research theme is 'Do Plants Learn from Stimuli? - Quantitative Analysis of Habituation to Specific Stimuli in Mimosa pudica.' The phenomenon of 'habituation,' where plants stop responding to repeated stimuli, is attracting attention as a primitive 'memory/learning' ability in plants.<br><br>The key to this research was reconsidering plant behavior, which had previously relied on visual inspection or simple measurement, as high-precision 'image' data. By utilizing a self-made photographing device and analysis program to quantify and visualize leaf opening and closing movements, I succeeded in quantitatively demonstrating the response regulation ability of Mimosa pudica, which had been ambiguous until now.<br><br>The fact that this approach of 'connecting' biological observation and information engineering analysis methods was evaluated gave me great confidence.<br><br>Moving forward, towards the Japan Student Science Award (Central Judging) as a representative of Nagano Prefecture, I will proceed with further data verification and scrutiny of logic. I would like to express my sincere gratitude to the teachers who guide me enthusiastically on a daily basis, friends with whom I exchanged discussions, and everyone who supports my research activities.",
                    images: getNewsImages("NaganoGakkasyo2025")
                },
                {
                    id: "UTokyoGSC-seika",
                    published: true,
                    date: "Nov 15, 2025",
                    title: "Research Presentation at UTokyoGSC-NEXT Stage 3 Achievement Presentation",
                    summary: "Presented research results on Mimosa pudica conducted under the guidance of the Suetsugu Laboratory at the University of Tokyo.",
                    fullContent: "On November 15, 2025, I participated in the Stage 3 Achievement Presentation of the University of Tokyo Global Science Campus (UTokyoGSC-Next). I have been conducting research activities under the guidance of Professor Noriyuki Suetsugu's laboratory at the University of Tokyo, and this was a culmination presentation marking a milestone.<br><br>Regarding my research theme 'Habituation of Mimosa pudica,' I gave a presentation mixing insights gained in the advanced environment of the Suetsugu Laboratory and results of 'image' analysis using a self-made system.<br><br>On the day, in addition to presentations by peers who ran through Stage 3 together, I was also able to hear unique and interesting research plans from Stage 2 students who are about to enter full-scale research, and I was surprised by the richness of their ideas. Being able to participate in a place of exchange that 'connects' passion for science across grades and stages is a great asset for me.<br><br>I would like to express my deep gratitude to Professor Suetsugu, everyone in the laboratory, and the secretariat. Using the experience gained here as sustenance, I will continue to push forward with my research activities.",
                    images: getNewsImages("UTokyoGSC")
                },
                {
                    id: "koushien",
                    published: true,
                    date: "Nov 29, 2025",
                    title: "Runner-up at Science Koushien Nagano Prefecture Qualifier (1st in Practical Skills)",
                    summary: "Contributed to the team as a biology specialist. Although we won 1st place overall in the practical competition, we unfortunately finished 2nd overall and missed the national tournament.",
                    fullContent: "On November 29, 2025, I participated in the 'Science Koushien' Nagano Prefecture Qualifier as a member of the school representative team (in charge of biology).<br><br>The result was 2nd place overall in the prefecture. We fell just one step short of the ticket to the national tournament given only to the winning team.<br><br>Regret remains that we could not extend our score in the written competition, but in the 'practical competition' where teamwork is tested, we were able to achieve the best result of 1st place overall. The process of members with different fields of expertise pooling their wisdom to tackle problem-solving was a very dense time.<br><br>Also, exploring and 'connecting' beyond the framework of the school with science-loving students from other high schools in the prefecture through the competition was a major harvest. Using the network gained here and the frustration of falling just short as a springboard, I would like to aim even higher in my individual research activities.",
                    images: getNewsImages("Koushien")
                },
                {
                    id: "mbsj-2025",
                    published: true,
                    date: "Dec 5, 2025",
                    title: "Poster Presentation at the 48th Annual Meeting of the Molecular Biology Society of Japan",
                    summary: "Presented two research results on Mimosa pudica and Hydra at one of the largest domestic conferences held at Pacifico Yokohama.",
                    fullContent: "On December 5, 2025, I participated in the High School Student Presentation Category of the '48th Annual Meeting of the Molecular Biology Society of Japan' held at Pacifico Yokohama.<br><br>This time, I gave presentations on two themes. The first was about my main theme 'Stimulus Habituation of Mimosa pudica,' focusing on analysis results using mathematical models. The second is research on 'Hydra' that I am working on jointly with friends as a school assignment study.<br><br>The venue was extremely large and I was overwhelmed by its scale, but there were sessions close to my research field, and it was very studying to be able to touch upon cutting-edge knowledge. Being able to discuss with many experts is a great asset.",
                    images: getNewsImages("MBSJ2025")
                },
                {
                    id: "sc-world-2025",
                    published: true,
                    date: "Dec 13, 2025",
                    title: "Presentation at Science Castle World 2025",
                    summary: "Participated in the research presentation held at the Institute of Science Tokyo. It was a valuable opportunity for exchange with peers from Japan and abroad.",
                    fullContent: "On December 13, 2025, I participated in a poster presentation at 'Science Castle World 2025' held at the Institute of Science Tokyo (formerly Tokyo Institute of Technology).<br><br>Although I did not receive an award this time, I gained an invaluable experience. In particular, meeting directly with seniors I had long wanted to talk to and discussing in English with participants from overseas was a great stimulation for me.<br><br>Also, I was able to reunite with friends I had made friends with through past science activities and talk about each other's research and recent events. It was a wonderful opportunity to strongly realize the 'connection with people' through research, more than the results.",
                    images: getNewsImages("SCWorld2025")
                },
                {
                    id: "acmb-jsmb-2025",
                    published: true,
                    date: "July 11, 2025",
                    title: "Poster Presentation at ACMB-JSMB2025",
                    summary: "Presented a mathematical model on the stimulus habituation mechanism of plants.",
                    fullContent: "Presented a poster on the stimulus habituation mechanism of Mimosa pudica at ACMB-JSMB2025. Analyzed the phenomenon, which can be called plant 'memory,' using mathematical models. This joint conference is a major academic event where cutting-edge research in mathematical biology from Asia and Japan gathers within one place.\nIn my presentation, I shared new insights obtained through mathematical approaches and model construction regarding the mechanism of how plants adapt to environmental stimuli and change their responses. In particular, I was able to have lively discussions with participating researchers about the results of analyzing the phenomenon of stimulus habituation in Mimosa pudica, which can be called 'memory,' using mathematical models, making it a very meaningful time.",
                    images: getNewsImages("ACMBJSMB")
                },
                {
                    id: "asc-2025",
                    published: true,
                    date: "Aug 7, 2025",
                    title: "Participated in Asian Science Camp 2025",
                    summary: "Exchange with young researchers from Asian countries.",
                    fullContent: "From July 31st to August 6th, 2025, I participated in the Asian Science Camp 2025 (ASC2025) held in Thailand as a member of the Japanese delegation. This camp is an international program aimed at fostering the next generation of scientists through lectures by Nobel laureates and world-class researchers, and exchanges with high school and university students selected from Asian countries.\nDuring the period, in addition to listening to lectures in a wide range of scientific fields, I participated in discussions with lecturers and participants, and group poster sessions. Through discussions with participants from various countries, I was able to touch upon diverse scientific perspectives and approaches, making it a very meaningful time. I would like to utilize the international experience and knowledge gained at this camp for my future research activities.",
                    images: getNewsImages("ASC2025")
                },
                {
                    id: "expo-workshop-announce",
                    published: true,
                    date: "Aug 11, 2025",
                    title: "[Announcement] Workshop at Osaka Expo",
                    summary: "Workshop to learn plant abilities through touch.",
                    fullContent: "On August 24, 2025, I will hold a workshop at the Osaka-Kansai Expo. We will provide experiences to touch plant intelligence, such as visualizing the electrical signals of Mimosa pudica.",
                    images: getNewsImages("Expo2025")
                },
                {
                    id: "expo-workshop-report",
                    published: true,
                    date: "Aug 24, 2025",
                    title: "Hosted a Workshop at Expo 2025 Osaka, Kansai",
                    summary: "Organized and hosted a science workshop on Mimosa pudica at the 'Playground of Life: Jellyfish Pavilion' in Expo 2025 Osaka, Kansai.",
                    fullContent: "On August 24, 2025, I successfully hosted a workshop titled 'The Landscape of Symbiosis Woven by Plants and People - Learning Plant Abilities through Touch' at the 'Playground of Life: Jellyfish Pavilion' in Expo 2025 Osaka, Kansai.<br><br>This workshop aimed to let people of all ages experience the fun of science through the mysterious abilities of Mimosa pudica, my research subject. I am truly grateful for the opportunity to present at such a special venue where people gather from all over the world.<br><br>On the day, we set up five stations where participants could intuitively experience plant capabilities. At the 'Mimosa Interaction Station,' detailed observations of leaves closing upon touch elicited surprises and cheers from children. Their shining eyes and questions like 'Why does it move?' and 'How does it work?' made it a very moving day, as I felt I was able to deliver seeds of science to the future.<br><br>This experience reaffirmed the importance and joy of giving back research findings to society. I intend to utilize this valuable learning not only for my future research activities but also for science education projects such as the 'Science Delivery Service' in Nagano.<br><br>Finally, I would like to express my sincere gratitude to everyone who visited, the Expo officials who supported the event, and the Jellyfish Pavilion staff.",
                    images: getNewsImages("expo_workshop")
                },
                {
                    id: "jbs-2025",
                    published: true,
                    date: "Sep 20, 2025",
                    title: "Presentation & Award at the 89th Annual Meeting of the Botanical Society of Japan",
                    summary: "Presented a poster and received an award at the Botanical Society of Japan. It was a valuable experience to discuss with many researchers.",
                    fullContent: "On Saturday, September 20, 2025, I participated in the High School Student Poster Presentation category at the '89th Annual Meeting of the Botanical Society of Japan' held at the Fukuoka International Congress Center.<br><br>This society is one of the largest academic gatherings for plant science research in Japan. I presented my research results based on the latest data obtained from a newly established experimental system.<br><br>On the day, I was blessed with the opportunity to directly discuss with many researchers active on the front lines in Japan and abroad through the poster session. We discussed for over 4 hours, receiving distinct feedback on my research and valuable advice leading to future developments, making it a very meaningful time.<br><br>As a result, I was fortunate enough to receive an award for my poster presentation. Encouraged by this award, I will continue to pursue further inquiries.<br><br>I would like to take this opportunity to express my sincere gratitude to the teachers who guided me and everyone who enthusiastically discussed at the booth.",
                    images: getNewsImages("JBS2025")
                },
                {
                    id: "rohto-future-2025",
                    published: true,
                    date: "Sep 28, 2025",
                    title: "Future Proposal Presentation at Rohto/Leave a Nest Co-Creation Project",
                    summary: "Presented a solution for mental illness in the year 2100 at Grand Green Osaka.",
                    fullContent: "On Sunday, September 28, 2025, I gave a presentation at the project results report meeting co-hosted by Rohto Pharmaceutical Co., Ltd. and Leave a Nest Co., Ltd., held at 'Grand Green Osaka' in front of Osaka Station.<br><br>This project aimed for high school students to explore future social issues and create 'future research themes' taking the opportunity of the Osaka Expo. As a team member, I tackled the magnificent theme of 'Mental Illness in 2100' for over two months.<br><br>Leading up to the presentation, in addition to repeated online discussions with the team, we actually visited the Osaka Expo to deepen our knowledge of future medical care and society. On the day, not only were we able to present the ideas we had refined, but we also had active discussions on proposals from other teams, making it a very fulfilling time.<br><br>Through this project, I became strongly conscious of the perspective of applied science: how to connect the knowledge of basic research such as Mimosa pudica and mathematical models that I have been working on to social implementation. This is a valuable experience that will be a major turning point in considering my career as a researcher.<br><br>I would like to express my sincere gratitude to everyone at Rohto Pharmaceutical Co., Ltd., Leave a Nest Co., Ltd., the team members who deepened their inquiries together, and everyone involved for giving me such a wonderful opportunity.",
                    images: getNewsImages("RohtoFuture2025")
                },
                {
                    id: "Gakkasyo-2025",
                    published: true,
                    date: "Dec 19, 2025",
                    title: "[Breaking] Received Minister's Award at JSSA & Selected for ISEF",
                    summary: "Received the Minister of State for Science and Technology Policy Award at the Japan Student Science Awards and qualified for ISEF. Honored to receive encouraging words from H.I.H. Crown Prince Akishino and Minister Onoda.",
                    fullContent: "At the 69th Japan Student Science Awards central ceremony, I received the Minister of State for Science and Technology Policy Award (5th place nationwide). This also confirmed my selection to represent Japan at ISEF (International Science and Engineering Fair), the world's largest student science contest held in the US next May.<br><br>I feel blessed to be chosen among many excellent researches. I am aware that the current evaluation includes a 'high school student bonus.' I renew my determination to go beyond such frameworks and devote myself further to be evaluated purely as a researcher.<br><br>After the ceremony, I had the honor of conversing with H.I.H. Crown Prince Akishino. His questions about my research and encouraging words were very inspiring. I also shook hands with Minister Onoda (Science and Technology Policy) and spoke directly about my research.<br><br>Connections with brilliant peer researchers met at the venue are a great asset. Cherishing these bonds, I will do my best on the world stage.",
                    images: getNewsImages("Gakkasyo-2025")
                },
                {
                    id: "ABA-Symposium-2026",
                    published: true,
                    date: "Jan 14, 2026",
                    title: "[Hong Kong] Oral & Poster Presentation at the 12th Asian Biophysics Association Symposium",
                    summary: "Participated in the ABA Symposium in Hong Kong, delivering an English poster presentation and my first-ever oral presentation. Grateful for the opportunity to challenge myself as a high school student, I experienced the fascination of biophysics and personal growth through solo overseas travel.",
                    fullContent: "On January 12th and 13th, I participated in 'The 12th Asian Biophysics Association (ABA) Symposium' held at the Hong Kong University of Science and Technology. This time, in addition to an English poster presentation, I challenged myself with my first-ever Oral Presentation.<br><br>The period from acceptance to the actual event was extremely short, and it was a tough situation where the manuscript wasn't finished until the night before. However, the enthusiasm to 'convey my research' prevailed during the actual performance, and I was able to present surprisingly smoothly (at the same time, I keenly felt the lack of basic English proficiency).<br><br>At the conference, I was able to connect with professors who are indispensable for future research, such as experts in membrane proteins. In addition to the macroscopic approach so far, I will deepen my research by incorporating a microscopic perspective of stimulus receptor sensors (membrane proteins). Touching upon the fun of the field of biophysics was also a major harvest.<br><br>Also, this was a completely solo trip. Due to lack of preparation, I encountered serious troubles with hotel and flight arrangements, but I keenly felt the appreciation for the support of those around me. Touching the exotic culture of Hong Kong, I feel that I have grown not only as a researcher but also as a person.<br><br>I would like to express my sincere gratitude to the secretariat for accepting me, a high school student outside the field, for an oral presentation, the Japan Science Society for their support, and my family (especially my mother) who helped me during the troubles.",
                    images: getNewsImages("ABA-Symposium-2026"),
                    link: "https://xiiaba.hkust.edu.hk/"
                },
                {
                    id: "isef-virtual-project-board-2026",
                    published: true,
                    date: "Apr 18, 2026",
                    title: "ISEF 2026 Project Page Published",
                    summary: "My project page has been published on the official Virtual Project Board for ISEF (International Science and Engineering Fair).",
                    fullContent: "Ahead of the 'ISEF (International Science and Engineering Fair)' to be held in Los Angeles, USA in May 2026, my project page has been published on the official Virtual Project Board.<br><br>The project title is 'Stimulus Discrimination and Memory in M. pudica'. I am very happy to have this wonderful opportunity to let people all over the world know about my research on Mimosa pudica. Please take a look from the link below.",
                    images: [],
                    link: "https://isef.net/project/plnt017-stimulus-discrimination-and-memory-in-m-pudica"
                },
                {
                    id: "rhabit-release-2026",
                    published: true,
                    date: "Apr 18, 2026",
                    title: "Released iOS App 'rHabit'",
                    summary: "Developed and published 'rHabit', an iOS tracking app that detects unconscious habits (like an open mouth) during focus using AI to support improvement.",
                    fullContent: "Do you ever find your mouth opening unconsciously while deeply focused on work or study? I have developed and independently released 'rHabit', an iOS app that detects these 'unconscious habits' in real-time using facial recognition AI to support your improvement.<br><br>Utilizing the iPhone's Face ID technology for completely local processing, it tracks seamlessly without disturbing your concentration. You can customize settings like 'how wide the mouth opens to detect' and it provides a gentle vibration to make you aware the moment a habit occurs. This app was inspired by my own experiences during long hours of concentration in research activities.<br><br>You can find more details on the <a href='https://kazueuglena.github.io/rHabit/' target='_blank' rel='noopener noreferrer' class='text-[#a7b08f] hover:underline'>Official Website</a> or download it directly from the <a href='https://apps.apple.com/jp/app/rhabit-%E7%84%A1%E6%84%8F%E8%AD%98%E3%81%AE%E3%82%AF%E3%82%BB%E6%94%B9%E5%96%84/id6761792769?l=en-US' target='_blank' rel='noopener noreferrer' class='text-[#a7b08f] hover:underline'>App Store</a>.",
                    images: [],
                    link: "https://apps.apple.com/jp/app/rhabit-%E7%84%A1%E6%84%8F%E8%AD%98%E3%81%AE%E3%82%AF%E3%82%BB%E6%94%B9%E5%96%84/id6761792769?l=en-US"
                },
                {
                    id: "isef-award-2026",
                    published: true,
                    date: "May 15, 2026",
                    title: "[Breaking] Won 3 Awards at Regeneron ISEF 2026",
                    summary: "Won three awards simultaneously at the Regeneron International Science and Engineering Fair (ISEF 2026): Plant Sciences Grand Award 2nd Place (2nd in the world), Arizona State University Award, and TÜBİTAK Award 1st Place.",
                    fullContent: "I participated as a member of the Japanese delegation in the Regeneron International Science and Engineering Fair (ISEF 2026), an international science research contest for high school students held in Phoenix, Arizona, USA, and presented my research in the Plant Sciences category.<br><br>At the Special Award Ceremony on the afternoon of May 14th and the Grand Award Ceremony on the morning of May 15th (local time), I was honored to receive three awards simultaneously: the Plant Sciences Grand Award 2nd Place (2nd in the world), the Arizona State University Award, and The Scientific and Technological Research Council of Türkiye (TÜBİTAK) Award 1st Place. This is the first time in 12 years that a Japanese finalist has won a Grand Award and two Special Awards simultaneously.<br><br>The research title was 'Learning Without a Brain: Habituation and Stimulus Discrimination in <i>Mimosa pudica</i> Explained by Mechanosensitive Channel Desensitization?'<br><br>During the fair, I had the opportunity to interact with approximately 1,800 finalists from about 70 countries and regions around the world, and undergo judging in English by experts in various fields. It was an incredibly meaningful opportunity for international exchange. I will continue to deepen my research, drawing on this invaluable experience.<br><br>I would like to express my heartfelt gratitude to everyone who has supported and guided me.",
                    images: getNewsImages("ISEF"),
                    link: ""
                },
                {
                    id: "mitoh-target-2026",
                    published: true,
                    date: "May 29, 2026",
                    title: "Selected for the 2026 Mitoh Target Program",
                    summary: "Selected for the Information-technology Promotion Agency (IPA) 2026 Mitoh Target Program in the Reservoir Computing division.",
                    fullContent: "I have been selected for the 2026 Mitoh Target Program (Software Development Division utilizing Reservoir Computing Technology) conducted by the Information-technology Promotion Agency, Japan (IPA).<br><br>The project theme is 'Turning Plant Habituation into Update Rules: Reservoir Computing Understanding of Mimosa pudica and Development of a Reservoir that Rests Computing — Habituation-RC (HRC).' I will be working on this research and development under the mentorship of Project Manager Prof. Gouhei Tanaka from the Nagoya Institute of Technology (Funding amount: 2,288,000 JPY).<br><br>In this project, I will reinterpret the 'habituation' phenomenon of Mimosa pudica—my core research subject—within the framework of reservoir computing, and challenge the development of a new dynamic reservoir 'HRC' that autonomously skips matrix operations for some nodes depending on the stationarity of the input. I aim to create next-generation edge AI that balances large memory capacity and event-driven ultra-low power consumption under constrained computational resources.<br><br>I will devote my full effort to this challenging project that 'connects' plant intelligence and information engineering.",
                    images: getNewsImages("Mitou"),
                    link: "https://www.ipa.go.jp/jinzai/mitou/target/2026-reservoir/gaiyou-tg-2.html"
                },
                {
                    id: "jsai-2026",
                    published: true,
                    date: "Jun 9, 2026",
                    title: "Presentation and Panel Discussion at JSAI 2026 National Conference",
                    summary: "Presented on the intersection of Mimosa pudica research and AI, and participated in a panel discussion at the JSAI 40th Anniversary Special Session 'Next-Generation AI for Science'.",
                    fullContent: "On June 9, 2026, I participated in a presentation and panel discussion at the 40th Anniversary Special Session 'Next-Generation AI for Science — What to Aim for and How to Proceed' at the Japanese Society for Artificial Intelligence National Conference (JSAI 2026).<br><br>In my presentation, I discussed my past experiments using Mimosa pudica from the perspective of 'AI for Science', the analogy between Mimosa pudica and AI information processing, AI development inspired by Mimosa pudica's information processing, and how a high school researcher interacts with AI.<br><br>In the panel discussion, we deeply debated how the next generation should interact with AI, deepen their thoughts, and grow in a society where AI is developing. We also touched upon what kind of existence AI is, when we feel a mind in it, and what mind or consciousness is, together with leading experts. It was a highly valuable experience.",
                    images: getNewsImages("JSAI"),
                    link: "https://conf.ai-gakkai.or.jp/jsai2026/ks/#ks-36"
                },
                {
                    id: "neuro-2026",
                    published: true,
                    date: "Aug 1, 2026",
                    title: "Received Top Award at NEURO2026 High School Poster Presentation",
                    summary: "Won the Top Award (最優秀賞) in the High School Poster Presentation at NEURO2026 for research on Mimosa pudica habituation.",
                    fullContent: "On August 1, 2026, I participated in the High School Student Poster Presentation at NEURO2026 (Joint Meeting of the 49th Annual Meeting of the Japan Neuroscience Society, the 69th Annual Meeting of the Japanese Society for Neurochemistry, and the 36th Annual Meeting of the Neural Network Society) held at Kobe International Conference Center and Kobe International Exhibition Hall, and was honored to receive the Top Award (最優秀賞).<br><br>The presentation focused on my long-standing research theme: 'Why does Mimosa pudica habituate to stimuli?' I presented quantitative evaluations using custom devices and AI to elucidate how brainless plants alter their responses based on experience.<br><br>I was fortunate to engage in fruitful discussions with many people, from high school peers to leading researchers. I was especially delighted when a researcher I had spoken with three years ago remembered me and visited my poster. The questions and comments from various perspectives inspired new questions I could not have reached alone, reaffirming the immense value of academic conferences.<br><br>I would like to express my sincere gratitude to the NEURO2026 organizers, my advisors, family, and everyone who continuously supports my research.",
                    images: getNewsImages("NEURO2026"),
                    link: "https://neuro2026.jnss.org/"
                }
            ],
            view_more_button: "View all news",
            details_button: "Details"
        },
        research: {
            title: "Research",
            heading_grants: "Funds & Grants",
            heading_awards: "Conferences & Presentations",
            description: "Conducting diverse research including verification and mathematical analysis of response regulation in Mimosa pudica, and classical conditioning in Hydra.",
            grants: [
                {
                    year: "2026",
                    title: "Information-technology Promotion Agency, Japan (IPA) Mitoh Target Program (Software Development Division utilizing Reservoir Computing)",
                    details: "Turning Plant Habituation into Update Rules: Reservoir Computing Understanding of Mimosa pudica and Development of a Reservoir that Rests Computing - Habituation-RC (HRC)",
                    link: "https://www.ipa.go.jp/jinzai/mitou/target/2026-reservoir/gaiyou-tg-2.html",
                    featured: true
                },
                {
                    year: "2025",
                    title: "LINOA Inc. (formerly ADvance Lab Inc.) Research Grant",
                    details: "Electrophysiological elucidation of response regulation mechanisms in Mimosa pudica (ADvance Lab 1st Cohort Additional Research Grant)",
                    link: "https://www.linoa-lab.co.jp/"
                },
                {
                    year: "2025",
                    title: "Nagano Prefecture Science Promotion Foundation Research Grant",
                    details: "Demonstration of classic conditioning in Hydra vulgaris",
                    link: "http://w2.avis.ne.jp/~nkagaku/jyoseikin.html"
                },
                {
                    year: "2025",
                    title: "UTokyoGSC-NEXT (JST STELLA) Research Grant",
                    details: "Demonstration of response regulation (habituation) in Mimosa pudica",
                    link: "https://gsc.iis.u-tokyo.ac.jp/",
                    featured: true
                },
                {
                    year: "2024",
                    title: "N High School Research Club Research Grant (Kadokawa Dwango School)",
                    details: "Elucidation of ecological significance of response regulation in Mimosa pudica",
                    link: "https://nnn.ed.jp/attractiveness/extracurricular/club/kenkyubu/"
                },
                {
                    year: "2024",
                    title: "Science Castle Research Grant (Value Co-creation Award)",
                    details: "Support for the planning stage of Mimosa pudica related research",
                    link: "https://www.daicel.com/news/2025/20250227_1082.html",
                    featured: true
                },
                {
                    year: "2024",
                    title: "Science Castle Research Grant (THK Award)",
                    details: "Development of stimulation device for response regulation mechanism in Mimosa pudica",
                    link: "https://www.monozukuri-zero.com/science-castle/"
                },
                {
                    year: "2024",
                    title: "ADvance Lab Inc. Research Grant",
                    details: "ADvance Lab 1st Cohort Research Grant",
                    link: "https://www.linoa-lab.co.jp/"
                },
                {
                    year: "2024",
                    title: "Japan Science Society Research Grant",
                    details: "Quantification of Mimosa pudica opening/closing using 3D reconstruction technology",
                    link: "https://www.jss.or.jp/fukyu/mentor/",
                    featured: true
                },
            ],
            awards: [
                {
                    year: "2026",
                    title: "NEURO2026 (Joint Meeting of JNS, JSN, and JNNS)",
                    prize: "High School Poster Presentation Top Award",
                    details: "Presented on 'Why does Mimosa pudica habituate to stimuli?' and received the Top Award (最優秀賞).",
                    link: "https://neuro2026.jnss.org/",
                    featured: true
                },
                {
                    year: "2026",
                    title: "Regeneron International Science and Engineering Fair",
                    prize: "Plant Sciences Category 2nd Place Grand Award (2nd in the world)",
                    details: "Presented under the title \"Learning Without a Brain: Habituation and Stimulus Discrimination in Mimosa pudica Explained by Mechanosensitive Channel Desensitization?\".",
                    link: "https://event.yomiuri.co.jp/jssa/",
                    featured: true
                },
                {
                    year: "2026",
                    title: "JSAI 2026 40th Anniversary Special Session 'AI for Science'",
                    prize: "Speaker & Panelist",
                    details: "Presented on the analogy between Mimosa pudica and AI information processing, and participated in a panel discussion with experts on how the next generation should interact with AI, mind, and consciousness.",
                    link: "https://www.ai-gakkai.or.jp/jsai2026/",
                    featured: true
                },
                {
                    year: "2026",
                    title: "Regeneron International Science and Engineering Fair",
                    prize: "Arizona State University",
                    details: "Presented under the title \"Learning Without a Brain: Habituation and Stimulus Discrimination in Mimosa pudica Explained by Mechanosensitive Channel Desensitization?\".",
                    link: "https://event.yomiuri.co.jp/jssa/",
                },
                {
                    year: "2026",
                    title: "Regeneron International Science and Engineering Fair",
                    prize: "The Scientific and Technological ResearchCouncil of Türkiye TUBITAK",
                    details: "Presented under the title \"Learning Without a Brain: Habituation and Stimulus Discrimination in Mimosa pudica Explained by Mechanosensitive Channel Desensitization?\".",
                    link: "https://event.yomiuri.co.jp/jssa/",
                },
                {
                    year: "2025",
                    title: "The 69th Japan Student Science Awards (High School Division)",
                    prize: "Minister of State for Science and Technology Policy Award",
                    details: "Presented on the demonstration of response regulation mechanisms in Mimosa pudica. Selected as a Nagano Prefecture representative and presented research results at the central review.",
                    link: "https://event.yomiuri.co.jp/jssa/",
                    featured: true
                },
                {
                    year: "2025",
                    title: "Science Castle World 2025",
                    prize: "-",
                    details: "Presented on response regulation and mechanism elucidation in Mimosa pudica. Exchanged opinions on the response regulation mechanism of Mimosa pudica.",
                    link: "https://castle.lne.st/schedule/science-castle-world-2025/",
                    featured: true
                },
                {
                    year: "2025",
                    title: "48th Annual Meeting of the Molecular Biology Society of Japan (High School Presentation)",
                    prize: "-",
                    details: "Presented on the ecological significance of response regulation in Mimosa pudica and classical conditioning in Hydra. Discussed the universality of learning through comparison with animal learning with experts.",
                    link: "https://pub.confit.atlas.jp/ja/event/mbsj2025/presentation/HS-P-34"
                },
                {
                    year: "2025",
                    title: "Nagano Prefecture Student Science Award (High School Division)",
                    prize: "Governor's Prize",
                    details: "Presented research on response regulation mechanisms in Mimosa pudica. Awarded the highest prefectural honor and qualified for the Japan Student Science Awards.",
                    link: "",
                    featured: true
                },
                {
                    year: "2025",
                    title: "89th Annual Meeting of the Botanical Society of Japan (High School Presentation)",
                    prize: "President's Award",
                    details: "Presented on the demonstration of response regulation mechanisms in Mimosa pudica. The originality of the experimental system construction and empirical results were evaluated as the President's Award.",
                    link: "https://bsj.or.jp/jpn/general/highschool/annual.php",
                    featured: true
                },
                {
                    year: "2025",
                    title: "Joint Conference of ACMB-JSMB",
                    prize: "-",
                    details: "Presented on the ecological significance of response regulation in Mimosa pudica using mathematical models. Deepened discussions on the constructed model with mathematical biologists.",
                    link: "https://pub.confit.atlas.jp/en/event/acmbjsmb2025/presentation/POS-06"
                },
                {
                    year: "2024",
                    title: "66th Annual Meeting of the Japanese Society of Plant Physiologists (High School Presentation)",
                    prize: "-",
                    details: "Presented research concept on response regulation mechanisms in Mimosa pudica. Received useful feedback on the experimental plan from many experts.",
                    link: "https://jspp.org/"
                },
                {
                    year: "2024",
                    title: "Science Castle 2024 Kanto",
                    prize: "Outstanding Poster Award",
                    details: "Presented research concept on response regulation mechanisms in Mimosa pudica. The proposal of an original experimental system and research plan were evaluated.",
                    link: "https://lne.st/2024/12/09/s-castle2024_kanto/"
                },
                {
                    year: "2024",
                    title: "88th Annual Meeting of the Botanical Society of Japan (High School Presentation)",
                    prize: "-",
                    details: "Presented a new hypothesis on plant memory and learning. Discussed the research plan to prove habituation in Mimosa pudica with researchers.",
                    link: "https://bsj.or.jp/"
                },
                {
                    year: "2023",
                    title: "1st Learning Co-creation Contest",
                    prize: "Juichi Yamagiwa Award",
                    details: "Presented research on nyctinastic movement and circadian rhythms in Mimosa pudica. Deep consideration based on a unique perspective was highly evaluated.",
                    link: "https://steam-band.com/mnb1/finalresult/"
                },
                {
                    year: "2023",
                    title: "Nagano Prefecture Student Science Award (Junior High School Division)",
                    prize: "Governor's Prize (2 consecutive years)",
                    details: "Presented on nyctinastic movement and circadian rhythms in Mimosa pudica. Deepening of research through continuous observation and multi-faceted perspectives was evaluated.",
                    link: ""
                },
                {
                    year: "2023",
                    title: "Science Castle 2023 Kanto",
                    prize: "Nipponham Award",
                    details: "Presented on nyctinastic movement and circadian rhythms in Mimosa pudica. Development of a novel opening/closing quantification method using deep learning was highly evaluated.",
                    link: "https://castle.lne.st/news/26052/"
                },
                {
                    year: "2023",
                    title: "Science Castle 2023 Kanto",
                    prize: "Outstanding Poster Award",
                    details: "Presented joint research on the photophobic response of Euglena. Collaborative results as a team and the quality of the poster presentation were evaluated.",
                    link: "https://castle.lne.st/news/26052/"
                },
                {
                    year: "2022",
                    title: "Nagano Prefecture Student Science Award (Junior High School Division)",
                    prize: "Governor's Prize",
                    details: "Presented research on nyctinastic movement in Mimosa pudica. Precise data collection and original viewpoints were evaluated, winning the highest prefectural award.",
                    link: ""
                },
                {
                    year: "2021",
                    title: "Nagano Prefecture Student Science Award (Junior High School Division)",
                    prize: "Excellence Award",
                    details: "Presented basic observation records of nyctinastic movement in Mimosa pudica. Persistent observation and scientific inquiry attitude were evaluated, winning the Excellence Award.",
                    link: ""
                },
            ],
            download_button: "Download PDF",
        },
        projects: {
            title: "Projects",
            view_all_button: "View all",
            categories: {
                foundation: { title: "Foundation (Past Projects)", period: "Past", status: "Done", color: "border-gray-500" },
                engineering: { title: "Engineering", period: "2024-2025", status: "Done", color: "border-white/40" },
                physiology: { title: "Physiology", period: "2025-", status: "Done", color: "border-white/40" },
                mechanism: { title: "Mechanism", period: "2026-", status: "Ongoing", color: "border-teal-500" },
                application: { title: "Application", period: "Present", status: "Ongoing", color: "border-teal-500" },
                vision: { title: "Vision", period: "2031-20XX", status: "Planning", color: "border-rose-500" }
            },
            items: [
                // --- Foundation ---
                {
                    id: "hydra-conditioning",
                    category: "foundation",
                    image: process.env.PUBLIC_URL + "/images/hydra.png",
                    title: "Behavioral Conditioning in Hydra vulgaris",
                    description: "Investigating associative learning (classical conditioning) in Hydra vulgaris, a species with a diffuse nervous system.",
                    period: "Past Project",
                    details: "Verified whether brainless Hydra exhibit associative learning. We repeatedly paired reduced glutathione (inducing feeding behavior) and blue light, and evaluated the responses using AI-based behavioral analysis, approaching the evolutionary origins of learning.",
                    featured: true,
                    techStack: ["Behavioral Experiments", "AI Analysis", "Evolutionary Approach"],
                    outcomes: ["Verified potential associative learning in Hydra", "Suggested evolutionary origins of memory formation"],
                    mentor: [],
                    funding: [],
                },
                {
                    id: "euglena-response",
                    category: "foundation",
                    image: process.env.PUBLIC_URL + "/images/euglena.png",
                    title: "Photophobic Response in Euglena",
                    description: "Analyzing the photophobic response of Euglena gracilis, which contract and change direction upon light exposure.",
                    period: "Past Project",
                    details: "Using deep learning models and segmentation for individual tracking, we confirmed a 'photophobic response' where swimming speed and rotational movement intensify in response to a rapid increase in blue light. We also discovered a similar response to physical vibrations.",
                    featured: false,
                    techStack: ["Deep Learning", "Segmentation", "Individual Tracking"],
                    outcomes: ["Confirmed photophobic response to blue light", "Discovered synchronized response to physical vibrations"],
                    mentor: [],
                    funding: [],
                },
                // --- Engineering ---
                {
                    id: "stimulator",
                    category: "engineering",
                    image: process.env.PUBLIC_URL + "/images/stimulation-device.png",
                    title: "Development of a Stimulation Device",
                    description: "Developed an original omnidirectional stimulation device to deliver controlled stimuli to Mimosa pudica.",
                    period: "2024-2025",
                    details: "To quantitatively evaluate the response of Mimosa pudica to stimuli, we independently developed an omnidirectional stimulation device capable of delivering precisely controlled stimuli from all directions. This enabled us to quantitatively evaluate the relationship between the plant's response and the direction and intensity of the stimulus.",
                    featured: false,
                    techStack: ["Hardware Design", "Control Engineering", "Arduino"],
                    outcomes: ["Successfully developed a device to deliver precise stimuli from any direction", "Established a foundation for quantitative response evaluation"],
                    mentor: [],
                    funding: [],
                },
                {
                    id: "leaf-quantification",
                    category: "engineering",
                    image: process.env.PUBLIC_URL + "/images/mimosa.jpg",
                    title: "Development of a Leaf Movement Quantification System",
                    description: "Constructed a quantitative analysis system for leaf opening/closing movements using deep learning.",
                    period: "2024-2025",
                    details: "To capture plant behaviors—which traditionally relied on visual inspection or simple measurements—as highly accurate continuous data, we constructed a system that continuously and quantitatively evaluates the opening degree of Mimosa pudica leaves utilizing image analysis technologies such as YOLOv9 and ConvNeXt.",
                    featured: false,
                    techStack: ["YOLOv9", "ConvNeXt", "Deep Learning", "Python"],
                    outcomes: ["Successfully acquired continuous digital image data of plant behaviors", "Achieved full automation of the analysis process"],
                    mentor: [],
                    funding: [],
                },
                // --- Physiology ---
                {
                    id: "mimosa-habituation",
                    category: "physiology",
                    image: process.env.PUBLIC_URL + "/images/mimosa_hab.jpg",
                    title: "Validation of Habituation in M. pudica",
                    description: "Demonstrated the capability of Mimosa pudica to learn (habituate) to stimuli and selectively regulate its responses.",
                    period: "2025",
                    details: "By combining the uniquely developed stimulation device and quantification technology, we behaviorally demonstrated that Mimosa pudica possesses the ability to identify stimuli and selectively regulate its responses (habituation-like response).",
                    featured: true,
                    techStack: ["Behavioral Science", "Quantitative Analysis", "Experimental Design"],
                    outcomes: ["Demonstrated M. pudica's ability to learn and discriminate stimuli", "Presented new behavioral evidence regarding plant 'intelligence'"],
                    mentor: [],
                    funding: [],
                },
                {
                    id: "ecological-habituation",
                    category: "physiology",
                    subProject: true,
                    image: process.env.PUBLIC_URL + "/images/ecological.png",
                    title: "Ecological Significance of Habituation in M. pudica (Sub project)",
                    description: "Analyzed the impact of 'habituation-like responses' on energy balance using a mathematical model.",
                    period: "2025",
                    details: "To elucidate the survival advantages of the 'habituation' phenomenon, we constructed a mathematical model considering the trade-off between the energy cost of leaf movement and predation risk, and quantitatively verified its superiority among different survival strategies.",
                    featured: false,
                    techStack: ["Mathematical Modeling", "Simulation", "Ecology"],
                    outcomes: ["Modeled the trade-off between energy cost and predation risk", "Quantitatively proved the survival advantage of habituation"],
                    mentor: [],
                    funding: [],
                },
                // --- Mechanism ---
                {
                    id: "math-modeling",
                    category: "mechanism",
                    image: process.env.PUBLIC_URL + "/images/mechanism-vivo.png",
                    title: "Mathematical Modeling of the Habituation-Like Response",
                    description: "Mathematical elucidation of the 'habituation-like response' based on the local desensitization hypothesis.",
                    period: "2026-Present",
                    details: "To reveal the mechanism by which Mimosa pudica 'remembers' stimuli and controls its response, we are approaching the entity of plant intelligence (information processing) through a mathematical approach that models local cellular fatigue (desensitization).",
                    featured: false,
                    techStack: ["Mathematical Biology", "ODEs", "Python"],
                    outcomes: ["Constructed a mathematical model based on the local desensitization hypothesis", "Provided a theoretical foundation for plant memory mechanisms"],
                    mentor: [],
                    funding: [],
                },
                {
                    id: "molecular-basis",
                    category: "mechanism",
                    image: process.env.PUBLIC_URL + "/images/mechanism-invitro.png",
                    title: "Molecular Basis of Habituation-Like Responses",
                    description: "Investigating the local desensitization hypothesis using calcium imaging techniques.",
                    period: "2026-Present",
                    details: "We verify the local cellular fatigue mechanism predicted by the mathematical model through calcium imaging experiments at Saitama University (Toyota Lab). By visualizing intracellular signal transduction, we approach the mechanism of habituation at the molecular level.",
                    featured: false,
                    techStack: ["Calcium Imaging", "Cell Biology", "Molecular Biology"],
                    outcomes: ["Established an experimental system to verify mathematical model predictions", "Visualized the habituation mechanism at the cellular level"],
                    funding: [],
                    mentor: ["Saitama Univ. Toyota Lab"],
                },
                // --- Application ---
                {
                    id: "hrc",
                    category: "application",
                    image: process.env.PUBLIC_URL + "/images/hrc.png",
                    title: "Development of Habituation Reservoir Computing (HRC)",
                    description: "Developing an efficient time-series processing algorithm inspired by Mimosa's habituation.",
                    period: "Present",
                    details: "This project mathematically models the habituation process and applies it to the update rules of reservoir computing. We aim to construct 'Habituation-RC' (HRC), a power-efficient and autonomous new computational model that performs calculations only when necessary.",
                    featured: true,
                    techStack: ["Reservoir Computing", "Neural Networks", "Mathematical Optimization"],
                    outcomes: ["Designed 'HRC', a power-efficient and autonomous new computational model"],
                    mentor: ["PM: Prof. Gouhei Tanaka (Nagoya Inst. of Tech.)"],
                    role: "Mitou Creator",
                    funding: ["IPA 2026 Mitou Target Program"],
                },
                {
                    id: "physical-reservoir",
                    category: "application",
                    image: process.env.PUBLIC_URL + "/images/mimosa-rc.png",
                    title: "Demonstration of RC-like Information Processing in M. pudica",
                    description: "Verifying whether M. pudica intrinsically functions as a 'pre-trained' physical reservoir model.",
                    period: "Present",
                    details: "Evaluating the information processing capabilities of natural plants within the framework of physical reservoir computing. We demonstrate how Mimosa pudica utilizes stimuli received from the environment as computational resources, exploring the potential of Plant Computing and its analogy to AI.",
                    featured: false,
                    techStack: ["Physical Reservoir Computing", "Information Theory", "Biometrics"],
                    outcomes: ["Demonstrated the concept of utilizing plants as computational resources", "Pioneered the potential of Plant Computing"],
                    mentor: ["PM: Prof. Gouhei Tanaka (Nagoya Inst. of Tech.)"],
                    funding: ["IPA 2026 Mitou Target Program"],
                },
                {
                    id: "stress-crop",
                    category: "application",
                    image: process.env.PUBLIC_URL + "/images/crop.png",
                    title: "Engineering Stress-Resilient Crops via Habituation",
                    description: "Applying habituation mechanisms to crops to enhance agricultural resilience.",
                    period: "Present",
                    details: "An applied project aiming to develop new stress-resilient crops capable of flexibly adapting to physical stress and environmental changes by applying the knowledge of 'habituation' and 'environmental adaptation' gained from Mimosa pudica to the agricultural field.",
                    featured: false,
                    techStack: ["Agriculture", "Plant Physiology", "Applied Research"],
                    outcomes: ["Applied habituation mechanisms to agriculture", "Established a foundation for developing highly adaptable next-generation crops"],
                    mentor: [],
                    funding: [],
                },
                // --- Vision ---
                {
                    id: "universal-intelligence",
                    category: "vision",
                    image: process.env.PUBLIC_URL + "/images/intelligence.png",
                    title: "Elucidating Universal Principles of Intelligence Beyond Substrates",
                    description: "Approaching common principles of 'intelligence' that transcend the presence of brains or hardware differences.",
                    period: "2031-20XX",
                    details: "The ultimate goal of this research is to elucidate the 'universal principles of intelligence' underlying animal nervous systems, plant networks, and even artificial intelligence (silicon substrates). We will construct a framework of information processing common to diverse systems and expand the definition of intelligence.",
                    featured: true,
                    techStack: ["Cognitive Science", "Complex Systems", "Systems Theory"],
                    outcomes: ["Constructed an information processing framework common to diverse systems", "Theoretical approach toward redefining 'intelligence'"],
                    mentor: [],
                    funding: [],
                },
                // --- Outreach ---
                {
                    id: "advancelab-vice",
                    category: "outreach",
                    image: process.env.PUBLIC_URL + "/images/advancelab.png",
                    title: "Vice Director, ADvance Lab",
                    description: "Managed a research community for students and established a platform for novel value creation.",
                    period: "Past Role",
                    details: "Served as Vice Director at ADvance Lab. Dedicated efforts to forming a community where middle school, high school, and university students could gather beyond the boundaries of grades and fields to actively discuss and conduct joint research. Contributed to value creation in the next-generation scientific community by building networks among young researchers.",
                    featured: false,
                    techStack: ["Community Management", "Mentoring", "Organization Management"],
                    outcomes: ["Formed a research community where students from different fields interact", "Provided a platform for novel value creation by young researchers"],
                    mentor: [],
                    funding: [],
                    role: "Vice Director",
                },
                {
                    id: "science-outreach",
                    category: "outreach",
                    image: process.env.PUBLIC_URL + "/images/science.png",
                    title: "Science Delivery Service",
                    description: "Organizing science workshops to bridge the educational gap between rural and urban areas.",
                    period: "24.11 - Present",
                    details: "A project launched from personal awareness of the opportunity gap in science education in rural areas. Planning and operating science classrooms for elementary students in Nagano Prefecture with familiar nature themes. Continuously conducting activities to bring out children's intellectual curiosity and convey the fun of science.",
                    featured: true,
                    techStack: ["Science Education", "Event Planning", "Communication"],
                    outcomes: ["Conducted numerous science classrooms for elementary students in Nagano", "Grassroots contribution to bridging the educational gap in rural areas"],
                    mentor: [],
                    funding: [],
                    role: "Planning & Operations Representative",
                }
            ]
        },
        map: {
            title: "Global Activity Map",
            description: "Connecting nodes across the globe",
            locations: [
                { id: "nagano", name: "Nagano (Hub)", x: 79.6, y: 49.5, image: process.env.PUBLIC_URL + "/images/mimosa_hab.jpg", details: "My home base and origin. Expanding the network of knowledge from here to the world." },
                { id: "san-francisco", name: "San Francisco, USA", x: 17, y: 48, image: process.env.PUBLIC_URL + "/images/san.jpg", details: "Visited as part of the Aoki Kanrinmaru Mission. Experienced the ecosystem and met with VCs during a one-week stay." },
                { id: "utah", name: "Utah, USA", x: 20, y: 47, image: process.env.PUBLIC_URL + "/images/utah.png", details: "One-month homestay during 5th grade. My first overseas experience, opening my eyes to the world through culture shock." },
                { id: "shanghai", name: "Shanghai, China", x: 75, y: 52, image: process.env.PUBLIC_URL + "/images/shanghai.jpg", details: "Two-week school exchange program in 9th grade. Deepened cultural understanding through dormitory life and classes." },
                { id: "singapore", name: "Singapore", x: 71.5, y: 65.7, image: process.env.PUBLIC_URL + "/images/singapore.png", details: "Two-week homestay in 9th grade. Deepened mutual understanding by overcoming cultural differences with a Muslim host family." },
                { id: "thailand", name: "Thailand", x: 71, y: 60, image: process.env.PUBLIC_URL + "/images/asc2025.png", details: "Participated in 'Asia Science Camp 2025' as a Japanese delegate. Deepened international perspectives through scientific discussions with students and Nobel laureates from Asia." },
                { id: "phoenix", name: "Phoenix, USA", x: 20, y: 50, image: process.env.PUBLIC_URL + "/images/ISEF2026.jpg", details: "Participated in 'Regeneron ISEF2026' as a Japanese delegate. Presented in the plant sciences division and won three awards, and interacted with participants from various countries." }
            ]
        },
        activities: {
            title: "Activities & Involvements",
            site_button: "Official Site",
            items: [
                { id: "gci", image: process.env.PUBLIC_URL + "/images/Matsuo2.png", year: "2025", title: "Matsuo Lab GCI", event: "Student", details: "Systematically learned data analysis and machine learning implementation using Python at the Data Science Course hosted by the University of Tokyo Matsuo Lab. Honed practical skills through competition-style assignments and established a foundation for quantification and analysis of experimental data in current research.", link: "https://weblab.t.u-tokyo.ac.jp/news/gci-2025-summer-%e3%81%ae%e5%8b%9f%e9%9b%86%e9%96%8b%e5%a7%8b/" },
                { id: "llm", image: process.env.PUBLIC_URL + "/images/Matsuo1.png", year: "2025", title: "Matsuo Lab LLM", event: "Student", details: "Learned cutting-edge engineering insights into Large Language Models (LLM). Deepened understanding of Generative AI architecture, serving as a catalyst for introducing AI into the scientific research process and exploring new approaches connecting biology and informatics.", link: "https://weblab.t.u-tokyo.ac.jp/large-language-model/" },
                { id: "stanford-entrepreneur", image: process.env.PUBLIC_URL + "/images/SPICE_entre.png", year: "2024-2025", title: "Stanford e-Entrepreneurship", event: "Student", details: "Learned the basics of entrepreneurship and business planning through online lectures by Stanford University instructors. Finally, planned a project to address the educational gap problem as a team and presented it in English.", link: "https://spice.fsi.stanford.edu/fellowship/stanford-e-entrepreneurship-japan" },
                { id: "stanford-japan", image: process.env.PUBLIC_URL + "/images/SPICE.png", year: "2025", title: "Stanford e-Japan", event: "Student", details: "Took lectures by experts on Japan-US relations and learned about Japan-US relations from multiple perspectives such as diplomacy, culture, and economy. Deepened international perspectives and discussion skills through discussions in English with other participants.", link: "https://spice.fsi.stanford.edu/fellowship/stanford-e-japan" },
                { id: "n1-dojo", image: process.env.PUBLIC_URL + "/images/n1.png", year: "2024-2025", title: "N1 Dojo", event: "5th Cohort", details: "In order to develop my 'Science Delivery Service' project as a business, under the guidance of a mentor, I learned the practical startup process such as formulating a business plan, analyzing target customers, and examining a revenue model.", link: "https://www.sunaba.org/n1dojo" },
                { id: "gsc-next", image: process.env.PUBLIC_URL + "/images/UTokyo.jpg", year: "2024-", title: "UTokyoGSC-NEXT", event: "6th Cohort", details: "Received lectures on cutting-edge science and technology from professors at the University of Tokyo and had the opportunity to deepen my own research theme. I am greatly stimulated by interacting with highly motivated peers of the same generation gathered from all over the country.", link: "https://gsc.iis.u-tokyo.ac.jp/" },
                { id: "advancelab", image: process.env.PUBLIC_URL + "/images/advancelab.png", year: "2024-", title: "ADvance Lab", event: "Vice Director", details: "Currently Involved in the operation of the lab as Vice Director. While creating new value by connecting the next generation and companies, I also plan events in rural areas to expand the circle of research.", link: "https://adlab.lne.st/" },
                { id: "aoki-kanrinmaru", image: process.env.PUBLIC_URL + "/images/aoki.png", year: "2022-2023", title: "Nagano Study Tour AOKI Kanrin Maru", event: "7th Cohort", details: "This program I participated in when I was a junior high school student is one of the origins of my current activities. During the training in Silicon Valley, I came into contact with a culture of challenging without fear of failure, which had a great influence on my own action guidelines.", link: "https://aoki-zaidan.or.jp/srv_kanrin.php" },
                { id: "tsukuba-skip", image: process.env.PUBLIC_URL + "/images/Tsukuba.png", year: "2021-2022", title: "Tsukuba SKIP Academy", event: "Student", details: "Solidified the foundation of logical thinking necessary for scientific research by touching on university-level mathematics and physics online. The experience at this time helps me in handling mathematical models in my current research.", link: "https://skip.tsukuba.ac.jp/" }
            ],
        },
        insights: {
            title: "Insights",
            description: "Small discoveries and reflections from my daily research and activities.",
            view_more_button: "View all",
            items: [
                {
                    id: "data-and-emotion",
                    date: "Mar 14, 2026",
                    title: "Quantum and Mimosa",
                    summary: "On the importance of interpreting and giving meaning to imperceptible phenomena.",
                    content: "When I visited the 'Mission ∞ Infinity | Space + Quantum + Art' exhibition at the Museum of Contemporary Art Tokyo, I had another realization.\n\nIn the quantum exhibition, the core lay in the process of interpreting and bringing meaning to phenomena that humans cannot directly perceive—like quantum entanglement and measurement—based on individual aesthetic senses. I felt this process was fundamentally similar to my research on Mimosa pudica.\n\nThe internal state of Mimosa pudica—for instance, the ion concentration in motor cells or the degree of MSL channel desensitization—can be measured and evaluated using sensors. However, this data by itself holds no meaning for humans. Even if we extract imperceptible phenomena as numerical values, they do not convey the essence. In this aspect, it is structurally identical to the characteristics of quantum phenomena.\n\nIn this context, I strongly felt that I want to convey the beauty and fascination of plants' information processing, such as the habituation phenomenon in Mimosa pudica, not merely by presenting data, but as an exhibition that directly appeals to emotions through interpreting and bringing meaning to those phenomena.",
                    tags: ["Research Philosophy", "Art", "Science"],
                    images: [],
                    link: ""
                },
                {
                    id: "embracing-unknown",
                    date: "Mar 14, 2026",
                    title: "On the Continuity of Art and Science",
                    summary: "Both science and art are essentially the same endeavor: presenting a way of seeing the world.",
                    content: "I recently visited the 'Mission ∞ Infinity | Space + Quantum + Art' exhibition at the Museum of Contemporary Art Tokyo. It was an exhibition that attempts to redefine and express insights from quantum technology and space development in an artistic context. Through this visit, I gained fascinating insights into the connection between science and art.\n\nBoth science and art are essentially the same in that they are 'endeavors to present a way of seeing the world.'\n\nNeither captures the world superficially; both attempt to describe the order, structure, continuity, and laws that exist behind it. While science distills these into 'reproducible forms' and art into 'perceivable forms,' there is a deep continuity in the attitude of questioning the unknown and scooping up the hard-to-see essence. Both endeavors begin by posing 'questions' to a complex, chaotic world, and go through a process of stripping away noise from countless pieces of information to extract only the hard-to-see essence—that is, abstraction.\n\nAt the 21st Century Museum of Contemporary Art in Kanazawa, which I visited last year, there was an exhibition by Stefano Mancuso, who researches plant intelligence (such as habituation in Mimosa pudica). In recent years, there has been an increase in cases where researchers exhibit in museums. I believe this is not mere coincidence, but because what researchers seek and what artists seek align in the space of museums.\n\nOn the scientist's side, there is a need to directly convey the 'emotionally compelling beauty' of phenomena discovered through research. On the artist's side, they are seeking cutting-edge materials for interpreting the contemporary world. Where these needs intersect, objective data is translated into subjective experience.",
                    tags: ["Research Philosophy", "Art", "Science"],
                    images: [],
                    link: "https://hemokosa.com/QCA/QCAbook.pdf"
                },
                {
                    id: "distributed-intelligence",
                    date: "Mar 14, 2026",
                    title: "Music Is a Complex System",
                    summary: "I realized that music functions as one giant \"complex system.\"",
                    content: "The other day, I listened to \"Elysium\" (2022) composed by Samy Moussa, performed by the Japan Philharmonic Orchestra at Suntory Hall. Until now, I had never been truly moved by classical music. However, this experience changed my perception.\n\nWhen the performance began, microscopic \"clouds of sound\" that even sounded like dissonance changed continuously and resonated through the hall. It wasn't just dissonance; it had a beauty as if expressing the grandeur of nature or the dynamic process of shifting life.\n\nWhy was I so drawn to it? I think it's because this music was functioning as one giant \"complex system.\" Following the micro and strict algorithm of the musical score, dozens of performers carve out specific frequencies and rhythms (although there are minute deviations, both intended and unintended). The emitted sound waves interfere non-linearly in space, breaking through the limits of predictable addition, and creating a \"surge of life\" on a macro scale.\n\nI thought it was very interesting. I would like to research it.",
                    tags: ["Research Philosophy", "Complex Systems"],
                    images: [],
                    link: "https://www.youtube.com/watch?v=cpaRD_ZWzTg&list=RDcpaRD_ZWzTg&start_radio=1"
                },
                {
                    id: "rural-to-global",
                    date: "Mar 5, 2026",
                    title: "From Rural to Global: Distance Is Not a Barrier",
                    summary: "Being in a rural area is not a handicap—it's an advantage.",
                    content: "Conducting research in Nagano, a rural area, sometimes feels inconvenient in terms of collaboration with researchers in Tokyo or abroad, attending conferences, and lack of research resources. But with online tools and social media, physical distance is becoming less of a fundamental barrier. Being in a rural area is not a handicap—it's a clear advantage that makes your perspective unique.",
                    tags: ["Rural"],
                    images: [],
                    link: ""
                },
                {
                    id: "science-for-kids",
                    date: "Jan 20, 2025",
                    title: "Saved by Children's 'Why?'",
                    summary: "The pure curiosity I encountered at the Science Delivery Service reminded me of my research origins.",
                    content: "At a recent Science Delivery Service event, a second-grade girl asked me, 'Why does Mimosa close its leaves at night?' I was impressed she knew about it. Academically, it's about circadian rhythms, but I remembered that I once looked at Mimosa with a similar sense of wonder. As research becomes more advanced, we tend to drift from that primal 'why?' But that question was where everything began. I think I'm teaching the children, but really, they're teaching me the most important thing.",
                    tags: ["Education"],
                    images: [],
                    link: ""
                }
            ]
        },
        media: {
            title: "Media",
            items: [
                {
                    date: "2026.05.25",
                    mediaName: "Yomiuri Shimbun (National Edition / Online)",
                    title: "Three Researches from Japan Student Science Awards Win Grand Awards at ISEF",
                    link: "https://www.yomiuri.co.jp/science/20260524-GYT8T00095",
                    image: "",
                    type: "newspaper | Web news",
                    description: "Featured in the morning national edition of the Yomiuri Shimbun and Yomiuri Shimbun Online, highlighting my achievements and awards at Regeneron ISEF 2026 as a representative of the Japan Student Science Awards.",
                },
                {
                    date: "2026.05.21",
                    mediaName: "TBS",
                    title: "Report on Receiving the Japan Student Science Award and Research Details",
                    link: "https://vt.tiktok.com/ZSxARN8Mv/",
                    image: getMediaImage("TBS"),
                    type: "TV",
                    description: "Reported on TBS's morning news program 'THE TIME,' specifically in the 'National High School Student News' segment, regarding my receiving the Minister of State for Science and Technology Policy Award at the Japan Student Science Awards and my research content.",
                },
                {
                    date: "2026.05.17",
                    mediaName: "Yomiuri Shimbun (National Edition) / Various Media",
                    title: "Reports on Receiving the 2nd Place Grand Award and Special Awards at Regeneron ISEF 2026",
                    link: "https://www.itmedia.co.jp/news/articles/2605/18/news123.html",
                    image: "",
                    type: "newspaper | Web news",
                    description: "Coverage on achieving the 2nd Place Grand Award in Plant Sciences, along with two Special Awards at the world's largest pre-college science competition, Regeneron ISEF 2026.",
                },
                {
                    date: "2026.03.26",
                    mediaName: "Yomiuri Shimbun (Local Edition)",
                    title: "Report on Receiving the Minister of State for Science and Technology Policy Award at the 69th Japan Student Science Awards",
                    link: "",
                    image: "",
                    type: "newspaper",
                    description: "Report on receiving the Minister of State for Science and Technology Policy Award at the Japan Student Science Awards and selection as an ISEF national representative of Japan.",
                },
                {
                    date: "2026.1.25",
                    mediaName: "Nagano Nippo",
                    title: "Report on Receiving the Governor's Prize at the Nagano Prefecture Student Science Award",
                    link: "https://www.nagano-np.co.jp/news/detail.php?id=5159",
                    image: "",
                    type: "newspaper",
                    description: "Report on receiving the top Governor's Prize for my research utilizing a custom-made image analysis system to clarify Mimosa habituation-like behavior.",
                },
                {
                    date: "2026.1.25",
                    mediaName: "Shinshu Shimin Shimbun",
                    title: "Report on Receiving the Governor's Prize at the Nagano Prefecture Student Science Award",
                    link: "https://www.shimin.co.jp/archives/12214",
                    image: "",
                    type: "newspaper",
                    description: "Report on receiving the top Governor's Prize for my research utilizing a custom-made image analysis system to clarify Mimosa habituation-like behavior.",
                },
                {
                    date: "2025.12.20",
                    mediaName: "Yomiuri Shimbun (National Edition)",
                    title: "Report on Receiving the Minister of State for Science and Technology Policy Award at the 69th Japan Student Science Awards",
                    link: "",
                    image: "",
                    type: "newspaper",
                    description: "Report on receiving the Minister of State for Science and Technology Policy Award at the Japan Student Science Awards and selection as an ISEF national representative of Japan.",
                },
                {
                    date: "2025.12.17",
                    mediaName: "ikuzy",
                    title: "Conveying the 'Excitement of Science' to Children – The Challenge of 'Science Demaebin'",
                    link: "https://ikuzy.com/babykids/%e9%ab%98%e6%a0%a1%e7%94%9f%e3%81%8c%e5%ad%90%e3%81%a9%e3%82%82%e3%81%9f%e3%81%a1%e3%81%ab%e4%bc%9d%e3%81%88%e3%82%8b%e7%a7%91%e5%ad%a6%e3%81%ae%e3%81%a8%e3%81%8d%e3%82%81%e3%81%8d/",
                    image: "",
                    type: "web",
                    description: "Introduction and interview about the initiatives of the volunteer team 'Science Demaebin' from Suwa Seiryo High School, which conducted a science workshop for elementary school children at the 'Aeon Mall Matsumoto x ikuzy' collaboration event.",
                },
                {
                    date: "2025.11.22",
                    mediaName: "Yomiuri Shimbun (Local Edition)",
                    title: "Report on Receiving the Nagano Prefecture Student Science Award (Governor's Prize)",
                    link: "",
                    image: "",
                    type: "newspaper",
                    description: "Report on receiving the top Governor's Prize at the Nagano Prefecture Student Science Award.",
                },
                {
                    date: "2025.10.12",
                    mediaName: "Steenz",
                    title: "Does Mimosa pudica 'remember'? A high school student passionate about Mimosa pudica research and science education from his hometown, Nagano [Kazuhiro Komatsu, 17 years old]",
                    link: "https://steenz.jp/48492/",
                    image: getMediaImage("steenz-25-10"),
                    type: "interview",
                    description: "An interview with 'Steenz,' a media platform showcasing active teens. I shared my passion for the memory mechanism of Mimosa pudica and my perspective on the educational gap between rural and urban areas.",
                },
                {
                    date: "2024.12.28",
                    mediaName: "Nagano Nippo",
                    title: "Seiryo High School Students as Lecturers: Science Class for Elementary School Children During Winter Break",
                    link: "https://www.nagano-np.co.jp/news/detail.php?id=2870",
                    image: getMediaImage("nippo-24-12"),
                    type: "newspaper",
                    description: "Report on a science class held by students of Suwa Seiryo High School for elementary school students during winter break, experimenting with paper airplanes.",
                },
                {
                    date: "2024.12.28",
                    mediaName: "NHK (Local Edition)",
                    title: "Seiryo High School Students as Lecturers: Science Class for Elementary School Children During Winter Break",
                    link: "https://www.nagano-np.co.jp/news/detail.php?id=2870",
                    image: getMediaImage("NHK-24-12"),
                    type: "TV",
                    description: "Report on a science class held by students of Suwa Seiryo High School for elementary school students during winter break, experimenting with paper airplanes.",
                },
            ]
        },
        contact: {
            title: "Connect",
            description: "Research, Co-creation, Dialogue.\nI look forward to connecting new synapses beyond all boundaries.",
            email: "koma1667@outlook.jp"
        },
        footer: {
            columns: [
                { title: "Explore", items: ["Profile", "Vision", "News", "Research", "Projects", "Map", "Insights", "Media"] },
                { title: "Activities", items: ["Activities", "ADvance Lab"] },
                { title: "Connect", items: ["Contact", "X (Twitter)", "Instagram", "Facebook", "LinkedIn", "GitHub"] }
            ]
        },
        all_news_page: {
            title: "All News",
            back_button: "Back"
        },
        all_projects_page: {
            title: "All Projects",
            back_button: "Back"
        }
    }
};

// Filter news items based on their published status
content.ja.news.items = content.ja.news.items.filter(item => item.published === true);
content.en.news.items = content.en.news.items.filter(item => item.published === true);


// --- Botanical Synapse Component (Fixed Background) ---
const BotanicalSynapse = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Respect users who prefer reduced motion — skip the canvas animation entirely.
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        const ctx = canvas.getContext('2d', { alpha: true });

        let animationFrameId;
        let isPaused = false;

        // --- 設定 ---
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        let width = window.innerWidth;
        let height = window.innerHeight;
        const isMobile = width < 600;

        const setCanvasSize = () => {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        setCanvasSize();

        const CONFIG = {
            nodeCount: isMobile ? 30 : (width < 1024 ? 50 : 80),
            connectDist: isMobile ? 100 : (width < 1024 ? 150 : 250),
            connectDistSq: (isMobile ? 100 : (width < 1024 ? 150 : 250)) ** 2,
            mouseRadiusSq: (isMobile ? 120 : 200) ** 2,

            friction: 0.98, wander: 0.005, repulseRadius: 80, repulseForce: 0.01,
            decay: 0.995, learn: 0.05, exciteDecay: 0.96,
            sigSpeed: 0.06, sigMaxGen: 4, refractory: 40, maxSigs: 40,
            colors: { base: [150, 150, 150], active: [230, 230, 230] } // ホワイト/グレー系の落ち着いた色
        };


        const state = {
            nodes: [], edges: [], signals: [], pulses: [],
            mouse: { x: -999, y: -999 }, time: 0
        };

        const distSq = (p1, p2) => (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
        const rand = (min, max) => Math.random() * (max - min) + min;

        // Bezier Helper
        const getBezierPos = (t, p0, cp1, cp2, p3) => {
            const mt = 1 - t, mt2 = mt * mt, t2 = t * t;
            return {
                x: mt * mt2 * p0.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t * t2 * p3.x,
                y: mt * mt2 * p0.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t * t2 * p3.y
            };
        };

        class Node {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.vx = rand(-0.1, 0.1); this.vy = rand(-0.1, 0.1);
                this.radius = this.baseR = rand(1, 3);
                this.excitation = 0;
                this.phase = rand(0, Math.PI * 2);
                this.sociability = Math.random() ** 2;
                this.wanderOff = rand(0, 1000);
                this.lastFire = -999;
            }

            update() {
                const t = state.time * 0.005 + this.wanderOff;
                this.vx += Math.cos(t) * CONFIG.wander;
                this.vy += Math.sin(t) * CONFIG.wander;

                const dSq = distSq(this, state.mouse);
                if (dSq < CONFIG.mouseRadiusSq) {
                    const f = 1 - (dSq / CONFIG.mouseRadiusSq);
                    this.excitation = Math.min(this.excitation + 0.05 * f, 1.0); // 興奮度アップ
                }

                this.x += this.vx; this.y += this.vy;
                this.vx *= CONFIG.friction; this.vy *= CONFIG.friction;
                this.excitation *= CONFIG.exciteDecay;

                if (this.x < -50) this.x = width + 50; else if (this.x > width + 50) this.x = -50;
                if (this.y < -50) this.y = height + 50; else if (this.y > height + 50) this.y = -50;

                this.phase += 0.015 + this.excitation * 0.05;
                this.radius = this.baseR + Math.sin(this.phase) * 0.5 + this.excitation * 3;
            }

            draw() {
                const { base, active } = CONFIG.colors;
                const e = this.excitation;
                const r = base[0] + (active[0] - base[0]) * e;
                const g = base[1] + (active[1] - base[1]) * e;
                const b = base[2] + (active[2] - base[2]) * e;

                ctx.beginPath();
                ctx.arc(this.x, this.y, Math.max(0, this.radius), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${0.3 + e * 0.7})`;
                ctx.fill();

                if (e > 0.05) {
                    const glow = this.radius * 4 + e * 10;
                    const grad = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, glow);
                    grad.addColorStop(0, `rgba(${r | 0},${g | 0},${b | 0},${0.15 * e})`);
                    grad.addColorStop(1, `rgba(${r | 0},${g | 0},${b | 0},0)`);
                    ctx.fillStyle = grad;
                    ctx.beginPath(); ctx.arc(this.x, this.y, glow, 0, Math.PI * 2); ctx.fill();
                }
            }

            fire() { if (state.time - this.lastFire > CONFIG.refractory) { this.excitation = 1.0; this.lastFire = state.time; return true; } return false; }
        }

        class Edge {
            constructor(a, b, weight = 0.05) {
                this.a = a; this.b = b;
                this.weight = weight;
                this.cpOffset = [rand(-1, 1), rand(-1, 1)];
                this.curveParams = null;
            }

            update() {
                if (distSq(this.a, this.b) < CONFIG.connectDistSq) {
                    this.weight += this.a.excitation * this.b.excitation * CONFIG.learn;
                }
                this.weight = Math.min(this.weight * CONFIG.decay, 1.0);
            }

            draw() {
                const dSq = distSq(this.a, this.b);
                if (this.weight < 0.05 || dSq > CONFIG.connectDistSq * 2.25) return;

                const d = Math.sqrt(dSq);
                const dx = this.b.x - this.a.x, dy = this.b.y - this.a.y;
                const angle = Math.atan2(dy, dx);
                const sway = Math.sin(state.time * 0.002 + this.a.x) * 0.2;

                const cp1 = { x: this.a.x + Math.cos(angle + this.cpOffset[0] + sway) * d * 0.33, y: this.a.y + Math.sin(angle + this.cpOffset[0] + sway) * d * 0.33 };
                const cp2 = { x: this.b.x + Math.cos(angle + Math.PI + this.cpOffset[1] + sway) * d * 0.33, y: this.b.y + Math.sin(angle + Math.PI + this.cpOffset[1] + sway) * d * 0.33 };

                this.curveParams = { p0: this.a, cp1, cp2, p3: this.b };

                ctx.beginPath();
                ctx.moveTo(this.a.x, this.a.y);
                ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, this.b.x, this.b.y);
                ctx.lineWidth = 0.5 + this.weight * 1.5;
                ctx.strokeStyle = this.weight > 0.4 ? `rgba(125, 120, 104,${this.weight * 0.4})` : `rgba(92, 88, 76,${this.weight * 0.2})`; // よりシックなグレー系の線
                ctx.stroke();
            }
            isDead() { return this.weight < 0.02 && distSq(this.a, this.b) > CONFIG.connectDistSq; }
        }

        class Signal {
            constructor(edge, from, gen = 0) {
                this.edge = edge; this.from = from;
                this.to = (edge.a === from) ? edge.b : edge.a;
                this.t = 0; this.gen = gen;
                this.speed = CONFIG.sigSpeed * (1 + edge.weight * 0.5);
            }
            update() {
                this.t += this.speed;
                if (this.t >= 1.0) {
                    this.edge.weight = Math.min(this.edge.weight + 0.1, 1.0);
                    return false;
                }
                return true;
            }
            draw() {
                if (!this.edge.curveParams) return;
                const p = getBezierPos(this.from === this.edge.b ? 1 - this.t : this.t, ...Object.values(this.edge.curveParams));
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(1, 2.5 - this.gen * 0.5), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(214, 208, 186,${0.8 - this.gen * 0.15})`;
                ctx.fill();
            }
        }

        class Pulse {
            constructor(x, y) { this.x = x; this.y = y; this.r = 0; this.life = 1; }
            update() { this.r += 2; this.life -= 0.015; }
            draw() {
                if (this.life <= 0) return;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(167,176,143,${this.life * 0.2})`; ctx.stroke();
            }
        }

        const spawnSignal = (edge, from, gen) => {
            if (state.signals.length < CONFIG.maxSigs) state.signals.push(new Signal(edge, from, gen));
        };

        const updateState = () => {
            state.time++;
            for (let i = state.edges.length - 1; i >= 0; i--) { state.edges[i].update(); if (state.edges[i].isDead()) state.edges.splice(i, 1); }
            const len = state.nodes.length;
            for (let i = 0; i < len; i++) {
                const nA = state.nodes[i];
                if (Math.random() < nA.sociability + 0.05) {
                    const nB = state.nodes[(Math.random() * len) | 0];
                    if (nA !== nB && distSq(nA, nB) < CONFIG.connectDistSq * (0.64 + nA.sociability)) {
                        if (!state.edges.some(e => (e.a === nA && e.b === nB) || (e.a === nB && e.b === nA))) {
                            if (Math.random() < 0.015 * (nA.sociability * nB.sociability + 0.2)) state.edges.push(new Edge(nA, nB));
                        }
                    }
                }
                for (let j = i + 1; j < len; j++) {
                    const nB = state.nodes[j];
                    const dx = nB.x - nA.x;
                    const dy = nB.y - nA.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < CONFIG.repulseRadius ** 2 && d2 > 0.1) {
                        const d = Math.sqrt(d2);
                        const f = (CONFIG.repulseRadius - d) / CONFIG.repulseRadius * CONFIG.repulseForce;
                        const rx = (dx / d) * f;
                        const ry = (dy / d) * f;
                        nA.vx -= rx; nA.vy -= ry;
                        nB.vx += rx; nB.vy += ry;
                    }
                }
            }
        };

        // Frame budget: target ~40fps on desktop, ~30fps on mobile to keep CPU/battery sane.
        const frameInterval = isMobile ? 1000 / 30 : 1000 / 40;
        let lastFrame = 0;
        const animate = (now) => {
            animationFrameId = requestAnimationFrame(animate);
            if (isPaused) return;
            if (now - lastFrame < frameInterval) return;
            lastFrame = now;

            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'source-over';
            updateState();
            state.edges.forEach(e => e.draw());
            state.nodes.forEach(n => { n.draw(); n.update(); });
            ctx.globalCompositeOperation = 'lighter';
            for (let i = state.signals.length - 1; i >= 0; i--) {
                const sig = state.signals[i];
                if (sig.update()) {
                    sig.draw();
                } else {
                    const target = sig.to;
                    if (target.fire() && sig.gen < CONFIG.sigMaxGen) {
                        const connected = [];
                        for (let k = 0; k < state.edges.length; k++) {
                            const e = state.edges[k];
                            if ((e.a === target || e.b === target) && e !== sig.edge) connected.push(e);
                        }
                        if (connected.length > 0) {
                            connected.sort(() => 0.5 - Math.random());
                            const limit = Math.min(connected.length, 2);
                            for (let k = 0; k < limit; k++) {
                                if (Math.random() < connected[k].weight * 0.8) spawnSignal(connected[k], target, sig.gen + 1);
                            }
                        }
                    }
                    state.signals.splice(i, 1);
                }
            }
            for (let i = state.pulses.length - 1; i >= 0; i--) {
                state.pulses[i].update(); state.pulses[i].draw();
                if (state.pulses[i].life <= 0) state.pulses.splice(i, 1);
            }
            ctx.globalCompositeOperation = 'source-over';
        };

        const handleInteraction = (x, y) => {
            state.mouse.x = x;
            state.mouse.y = y;
            let clicked = null;
            const clickSq = 30 * 30;
            for (let n of state.nodes) {
                if (distSq(n, { x, y }) < clickSq) {
                    clicked = n;
                    break;
                }
            }
            state.pulses.push(new Pulse(x, y));
            if (clicked) {
                if (clicked.fire()) {
                    let count = 0;
                    for (let e of state.edges) {
                        if (e.a === clicked || e.b === clicked) {
                            if (e.weight > 0.05) spawnSignal(e, clicked, 0);
                            count++;
                            if (count >= 3) break;
                        }
                    }
                }
            } else {
                const n = new Node(x, y);
                n.fire(); n.sociability = 1; state.nodes.push(n);
                if (state.nodes.length > (isMobile ? 70 : 120)) state.nodes.shift();
            }
        };

        const forceConnections = () => {
            const len = state.nodes.length;
            for (let i = 0; i < len; i++) {
                for (let j = i + 1; j < len; j++) {
                    const nA = state.nodes[i];
                    const nB = state.nodes[j];
                    const dSq = distSq(nA, nB);
                    if (dSq < CONFIG.connectDistSq) {
                        const d = Math.sqrt(dSq);
                        let prob = 0.1;
                        if (d < CONFIG.connectDist * 0.4) prob = 0.7;
                        else if (d < CONFIG.connectDist * 0.7) prob = 0.3;
                        if (Math.random() < prob) {
                            state.edges.push(new Edge(nA, nB, rand(0.3, 0.6)));
                        }
                    }
                }
            }
        };

        // Init
        for (let i = 0; i < CONFIG.nodeCount; i++) state.nodes.push(new Node(rand(0, width), rand(0, height)));
        forceConnections();
        animationFrameId = requestAnimationFrame(animate);

        // Throttle resize to avoid thrashing canvas reallocation.
        let resizeTimer = null;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                width = window.innerWidth;
                height = window.innerHeight;
                setCanvasSize();
            }, 150);
        };
        // Throttle mousemove to ~60Hz max with rAF coalescing.
        let pendingMouse = null;
        const flushMouse = () => {
            if (pendingMouse) { state.mouse.x = pendingMouse.x; state.mouse.y = pendingMouse.y; pendingMouse = null; }
        };
        const handleMouseMove = e => { pendingMouse = { x: e.clientX, y: e.clientY }; flushMouse(); };
        const handleMouseDown = e => handleInteraction(e.clientX, e.clientY);
        const handleTouchStart = e => {
            const t = e.touches[0];
            handleInteraction(t.clientX, t.clientY);
        };
        const handleTouchMove = e => {
            const t = e.touches[0];
            state.mouse.x = t.clientX; state.mouse.y = t.clientY;
        };
        const handleTouchEnd = () => { state.mouse.x = -999; state.mouse.y = -999; };
        const handleVisibility = () => { isPaused = document.hidden; };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none" />;
};


// --- 新しいイントロアニメーション (Random Node Loading) ---
// --- イントロアニメーション (Synaptic Genesis) ---
const INTRO_WORDS = ['People', 'Region', 'Knowledge', 'Science', 'Future', 'Nature', 'Intelligence', 'Empathy', 'Technology', 'Life', 'Synapse', 'Universe', 'Society', 'Ideas', 'World'];
const INTRO_TITLE = 'Intelligence is Connection';

const NodeIntro = ({ onFinish }) => {
    const canvasRef = useRef(null);
    const finishedRef = useRef(false);
    const [showSkip, setShowSkip] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

    const finish = useCallback(() => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        onFinish();
    }, [onFinish]);

    // Reduced motion: 短時間で終了
    useEffect(() => {
        if (!reduced) return;
        const t = setTimeout(finish, 900);
        return () => clearTimeout(t);
    }, [reduced, finish]);

    useEffect(() => {
        const t = setTimeout(() => setShowSkip(true), 1500);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setWordIndex(i => (i + 1) % INTRO_WORDS.length), 400);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (reduced) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = window.innerWidth;
        let h = window.innerHeight;

        // 樹状突起を描き足していく永続レイヤー
        const trail = document.createElement('canvas');
        const tctx = trail.getContext('2d');

        const setSize = () => {
            w = window.innerWidth; h = window.innerHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            trail.width = w * dpr; trail.height = h * dpr;
            tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            tctx.lineCap = 'round';
        };
        setSize();

        const isMobile = w < 600;
        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.min(w, h) * (isMobile ? 0.44 : 0.38);
        const rand = (a, b) => Math.random() * (b - a) + a;

        const branches = [];
        const nodes = [];
        const signals = [];
        let totalBranches = 0;
        const MAX_BRANCHES = isMobile ? 70 : 110;

        const spawnBranch = (x, y, angle, depth, delay) => {
            if (totalBranches >= MAX_BRANCHES) return;
            totalBranches++;
            branches.push({
                x, y, angle, depth, delay,
                speed: rand(1.6, 2.6) * (1 - depth * 0.12),
                life: rand(50, 120) * (1 - depth * 0.18),
                points: [{ x, y }],
                done: false
            });
        };

        const TRUNKS = 7;
        for (let i = 0; i < TRUNKS; i++) {
            const a = (i / TRUNKS) * Math.PI * 2 + rand(-0.35, 0.35);
            spawnBranch(cx, cy, a, 0, i * 5 + rand(0, 8));
        }

        let frameId;
        let bloom = 0;
        const start = performance.now();

        const render = (now) => {
            const t = (now - start) / 1000;
            ctx.clearRect(0, 0, w, h);

            // 成長: 新しいセグメントだけを永続レイヤーに描く
            branches.forEach(b => {
                if (b.done) return;
                if (b.delay > 0) { b.delay--; return; }

                const px = b.x, py = b.y;
                b.angle += rand(-0.22, 0.22);
                const outward = Math.atan2(b.y - cy, b.x - cx);
                b.angle += Math.sin(outward - b.angle) * 0.06;
                b.x += Math.cos(b.angle) * b.speed;
                b.y += Math.sin(b.angle) * b.speed;
                b.points.push({ x: b.x, y: b.y });
                b.life--;

                tctx.beginPath();
                tctx.moveTo(px, py);
                tctx.lineTo(b.x, b.y);
                tctx.strokeStyle = `rgba(150, 148, 130, ${Math.max(0.07, 0.3 - b.depth * 0.07)})`;
                tctx.lineWidth = Math.max(0.4, 1.6 - b.depth * 0.4);
                tctx.stroke();

                if (b.depth < 3 && b.points.length > 8 && Math.random() < 0.04) {
                    spawnBranch(b.x, b.y, b.angle + rand(0.5, 1.1) * (Math.random() < 0.5 ? 1 : -1), b.depth + 1, 0);
                }

                if (b.life <= 0 || Math.hypot(b.x - cx, b.y - cy) > maxR) {
                    b.done = true;
                    nodes.push({ x: b.x, y: b.y, r: rand(1.2, 2.4) + (3 - b.depth) * 0.3, phase: rand(0, Math.PI * 2) });
                }
            });

            ctx.drawImage(trail, 0, 0, w, h);

            // 中心のシード (タイトル表示後は減光して文字を引き立てる)
            const seedScale = Math.min(1, t / 0.4);
            const dim = t < 2 ? 1 : Math.max(0.3, 1 - (t - 2) * 0.5);
            const seedR = 4.5 * seedScale * (1 + Math.sin(t * 3.2) * 0.18);
            const glowR = Math.max(1, seedR * 9);
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
            grad.addColorStop(0, `rgba(214, 208, 186, ${0.5 * dim})`);
            grad.addColorStop(1, 'rgba(214, 208, 186, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx, cy, Math.max(0.5, seedR), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(237, 230, 214, ${0.95 * dim})`;
            ctx.fill();

            // 末端ノードの明滅 + 経路を走る信号
            ctx.globalCompositeOperation = 'lighter';
            nodes.forEach(n => {
                const tw = 0.5 + Math.sin(t * 2.4 + n.phase) * 0.5;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(167, 176, 143, ${0.25 + 0.45 * tw})`;
                ctx.fill();
            });

            if (t > 1.1 && signals.length < 8 && Math.random() < 0.14) {
                const grown = branches.filter(b => b.points.length > 20);
                if (grown.length) signals.push({ b: grown[(Math.random() * grown.length) | 0], i: 0, speed: rand(1.5, 3.5) });
            }
            for (let i = signals.length - 1; i >= 0; i--) {
                const s = signals[i];
                s.i += s.speed;
                const p = s.b.points[s.i | 0];
                if (!p) { signals.splice(i, 1); continue; }
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7);
                g.addColorStop(0, 'rgba(222, 216, 196, 0.9)');
                g.addColorStop(1, 'rgba(222, 216, 196, 0)');
                ctx.fillStyle = g;
                ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';

            // ブルームリング → 終了
            if (t > 3.7) {
                bloom += 0.03;
                ctx.beginPath();
                ctx.arc(cx, cy, bloom * maxR * 2.4, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(214, 208, 186, ${Math.max(0, 0.4 - bloom * 0.4)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            if (t > 4.3) { finish(); return; }

            frameId = requestAnimationFrame(render);
        };
        frameId = requestAnimationFrame(render);

        window.addEventListener('resize', setSize);
        return () => { cancelAnimationFrame(frameId); window.removeEventListener('resize', setSize); };
    }, [reduced, finish]);

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-[#15140f] overflow-hidden cursor-pointer select-none"
            exit={{ opacity: 0, scale: 1.045 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            onClick={finish}
        >
            {!reduced && <canvas ref={canvasRef} className="absolute inset-0" />}

            {/* タイトル: 1文字ずつブラー解除で浮かび上がる */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6">
                <h1 className="text-[28px] md:text-[48px] font-medium tracking-[-0.01em] text-[#ede6d6] text-center">
                    {(() => {
                        let charIdx = 0;
                        return INTRO_TITLE.split(' ').map((word, wi, arr) => {
                            const chars = word.split('').map((ch) => {
                                const i = charIdx++;
                                return (
                                    <motion.span
                                        key={i}
                                        className="inline-block"
                                        initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        transition={{ duration: 0.8, delay: (reduced ? 0.1 : 1.5) + i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        {ch}
                                    </motion.span>
                                );
                            });
                            charIdx++; // スペース分のディレイを保つ
                            return (
                                <React.Fragment key={wi}>
                                    <span className="inline-block whitespace-nowrap">{chars}</span>
                                    {wi < arr.length - 1 && ' '}
                                </React.Fragment>
                            );
                        });
                    })()}
                </h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: reduced ? 0.2 : 2.5 }}
                    className="mt-4 text-[14px] md:text-[15px] text-[#a39c89]"
                >
                    Kazuhiro Komatsu
                </motion.p>
            </div>

            {/* Connecting ワードサイクル (穏やかなクロスフェード) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.5 }}
                className="absolute bottom-24 left-0 w-full text-center z-10 text-[#6f6a5c] text-[13px] md:text-[14px]"
            >
                Connecting{' '}
                <AnimatePresence mode="wait">
                    <motion.span
                        key={wordIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="text-[#a7b08f] inline-block"
                    >
                        {INTRO_WORDS[wordIndex]}
                    </motion.span>
                </AnimatePresence>
            </motion.div>

            {/* スキップ表示 */}
            <AnimatePresence>
                {showSkip && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute bottom-8 right-8 text-[13px] text-[#a39c89]"
                    >
                        Tap to skip
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


// --- アニメーション化されたテキストコンポーネント ---
const AnimatedText = ({ text }) => (
    <AnimatePresence mode="wait">
        <motion.span key={text} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {text}
        </motion.span>
    </AnimatePresence>
);

// --- アイコンコンポーネント ---
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const TwitterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>);
const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>);
const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.451 2.535c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>);
const FacebookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>);
const LinkedinIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>);
const GitHubIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>);
const ChevronDownIcon = ({ isExpanded }) => (
    <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 text-[#a39c89] flex-shrink-0 mt-1"
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3 }}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </motion.svg>
);
const MailIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);
const DownloadIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);
const ChevronLeftIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);
const ChevronRightIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);
const ExternalLinkIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
);
const ArrowRightIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);


// --- カスタムカーソルコンポーネント (Dot + Trailing Ring) ---
// --- Design tokens (warm charcoal, one muted accent; Archivo everywhere) ---
const T = {
    bg: 'bg-[#15140f]',
    surf: 'bg-[#1b1a14]',
    fg: 'text-[#ede6d6]',
    body: 'text-[#d6cfbf]',
    muted: 'text-[#a39c89]',
    faint: 'text-[#6f6a5c]',
    line: 'border-[#2e2b22]',
    acc: 'text-[#a7b08f]',
    accBorder: 'border-[#a7b08f]',
    hoverAcc: 'hover:text-[#a7b08f]',
    hoverFg: 'hover:text-[#ede6d6]',
};

const CONTAINER = 'max-w-5xl mx-auto px-5 sm:px-8';

// --- Header ---
const Header = ({ lang, setLang, content, setPage }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) lockBodyScroll(); else unlockBodyScroll();
        return () => unlockBodyScroll();
    }, [isMobileMenuOpen]);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        setPage('home');
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${isScrolled ? `bg-[#15140f]/90 backdrop-blur-sm ${T.line}` : 'bg-transparent border-transparent'}`}>
                <nav className={`${CONTAINER} flex items-center justify-between h-16`}>
                    <span onClick={() => scrollToSection('hero')} className={`text-[15px] font-medium ${T.fg} cursor-pointer`}>Kazuhiro Komatsu</span>
                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-5">
                            {Object.entries(content.nav).map(([key, value]) => (
                                <a key={key} onClick={() => scrollToSection(key)} className={`text-[14px] ${T.muted} ${T.hoverFg} cursor-pointer transition-colors`}>{value}</a>
                            ))}
                        </div>
                        <button onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')} className={`text-[14px] ${T.muted} ${T.hoverFg} flex items-center gap-1.5 transition-colors`}>
                            <GlobeIcon />
                            <span>{lang === 'ja' ? 'EN' : 'JP'}</span>
                        </button>
                        <button
                            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Menu"
                        >
                            <motion.span animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block w-5 h-px bg-[#ede6d6]" />
                            <motion.span animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-px bg-[#ede6d6]" />
                            <motion.span animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block w-5 h-px bg-[#ede6d6]" />
                        </button>
                    </div>
                </nav>
            </header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-40 bg-[#15140f]/95 flex flex-col items-start justify-center lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <nav className={`${CONTAINER} w-full flex flex-col items-start gap-1`} onClick={(e) => e.stopPropagation()}>
                            {Object.entries(content.nav).map(([key, value], index) => (
                                <motion.a
                                    key={key}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: index * 0.03 }}
                                    onClick={() => scrollToSection(key)}
                                    className={`text-[22px] font-medium ${T.fg} ${T.hoverAcc} cursor-pointer transition-colors py-1.5`}
                                >
                                    {value}
                                </motion.a>
                            ))}
                            <button onClick={() => { setLang(lang === 'ja' ? 'en' : 'ja'); setIsMobileMenuOpen(false); }} className={`mt-6 pt-6 border-t ${T.line} w-full text-left text-[15px] ${T.muted} ${T.hoverFg} flex items-center gap-2`}>
                                <GlobeIcon />
                                {lang === 'ja' ? 'English' : '日本語'}
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};


// --- Hero (bottom-right, one quiet fade) ---
const HeroSection = ({ content }) => {
    const words = content.hero.title.split(' ');
    const leading = words.slice(0, -1).join(' ');
    const lastWord = words[words.length - 1];

    return (
        <section id="hero" className="min-h-[100dvh] w-full relative flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-[#15140f] via-transparent to-transparent pointer-events-none" />
            <div className={`${CONTAINER} relative z-10 w-full pb-16 md:pb-24 flex justify-end`}>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="text-right max-w-2xl"
                >
                    <h1 className={`text-[40px] md:text-[64px] font-medium leading-[1.02] tracking-[-0.015em] ${T.fg} mb-5 [text-wrap:balance]`}>
                        {leading}{leading && ' '}<span className={T.acc}>{lastWord}</span>
                    </h1>
                    <p className={`text-[16px] md:text-[17px] ${T.muted}`}>{content.hero.subtitle}</p>
                    <p className={`text-[15px] ${T.fg} mt-1.5`}>{content.hero.name_label}</p>
                </motion.div>
            </div>
        </section>
    );
};


// --- Research (year / title / result rows) ---
const ResearchRow = ({ item, category, onDetailSelect }) => (
    <div
        onClick={() => onDetailSelect({ ...item, category })}
        className={`group grid grid-cols-[64px_1fr] md:grid-cols-[72px_1fr_auto] gap-x-4 gap-y-1 items-baseline py-3.5 border-b ${T.line} cursor-pointer`}
    >
        <span className={`text-[15px] ${T.muted} tabular-nums`}>{item.year}</span>
        <span className={`text-[16px] md:text-[17px] ${T.fg} ${T.hoverAcc} leading-snug transition-colors`}>{item.title}</span>
        {item.prize && <span className={`col-start-2 md:col-start-3 text-[14px] ${T.acc} md:text-right md:max-w-[22rem] leading-snug`}>{item.prize}</span>}
    </div>
);

const ResearchListGroup = ({ title, items, category, onDetailSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const sortedItems = [...items].sort((a, b) => parseInt(b.year) - parseInt(a.year));
    const shown = isExpanded ? sortedItems : sortedItems.slice(0, 3);

    return (
        <div className="mb-10 last:mb-0">
            <h3 className={`text-[15px] font-medium ${T.fg} mb-1`}>{title}</h3>
            <div className={`border-t ${T.line}`}>
                {shown.map((item, index) => (
                    <ResearchRow key={`${title}-${index}-${item.title}`} item={item} category={category} onDetailSelect={onDetailSelect} />
                ))}
            </div>
            {sortedItems.length > 3 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`mt-3 text-[14px] ${T.muted} ${T.hoverFg} transition-colors`}
                >
                    {isExpanded ? 'Show fewer' : `Show all (${sortedItems.length})`}
                </button>
            )}
        </div>
    );
};

const ResearchSection = ({ content, onDetailSelect, ui }) => {
    return (
        <ContentSection id="research" title={content.research.title}>
            <p className={`text-[16px] md:text-[17px] ${T.body} leading-[1.65] max-w-[64ch] mb-10`}>{content.research.description}</p>
            <ResearchListGroup title={content.research.heading_grants} items={content.research.grants} category="grant" onDetailSelect={onDetailSelect} />
            <ResearchListGroup title={content.research.heading_awards} items={content.research.awards} category="award" onDetailSelect={onDetailSelect} />
        </ContentSection>
    );
};



// --- Section shell: big left-aligned heading with a rule ---
const SectionTitle = ({ title }) => <span>{title}</span>;

const ContentSection = ({ id, title, children }) => (
    <section id={id.toLowerCase()} className="py-14 md:py-20 relative">
        <div className={`${CONTAINER} relative z-10`}>
            <h2 className={`text-[28px] md:text-[34px] font-medium tracking-[-0.01em] ${T.fg} pb-3 mb-8 md:mb-10 border-b ${T.line}`}>
                <SectionTitle title={title} />
            </h2>
            {children}
        </div>
    </section>
);


// --- News: one lead story + a dated list ---
const parseNewsDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split('.');
    if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2]);
    return new Date(dateStr);
};

const NewsSection = ({ content, onNewsSelect, setPage, ui }) => {
    const sortedNews = [...content.news.items].sort((a, b) => parseNewsDate(b.date) - parseNewsDate(a.date));
    const lead = sortedNews[0];
    const rest = sortedNews.slice(1, 4);
    const thumbOf = (item) => (item.images && item.images.length > 0 ? item.images[0] : null);

    return (
        <ContentSection id="news" title={content.news.title}>
            <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 md:gap-10">
                {lead && (
                    <article onClick={() => onNewsSelect(lead)} className="group cursor-pointer min-w-0">
                        {thumbOf(lead) && (
                            <div className={`aspect-[16/10] overflow-hidden ${T.surf} mb-4`}>
                                <img src={thumbOf(lead)} alt="" className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90" loading="lazy" decoding="async" />
                            </div>
                        )}
                        <p className={`text-[14px] ${T.muted} tabular-nums`}>{lead.date}</p>
                        <h3 className={`text-[24px] md:text-[30px] font-medium leading-[1.15] tracking-[-0.01em] ${T.fg} ${T.hoverAcc} mt-1.5 transition-colors [text-wrap:balance]`}>{lead.title}</h3>
                    </article>
                )}
                <div className="flex flex-col min-w-0">
                    {rest.map((item, index) => (
                        <article key={item.id || index} onClick={() => onNewsSelect(item)} className={`group cursor-pointer py-4 border-t ${T.line} ${index === 0 ? 'md:border-t-0 md:pt-0' : ''}`}>
                            <p className={`text-[14px] ${T.muted} tabular-nums`}>{item.date}</p>
                            <h3 className={`text-[18px] md:text-[19px] font-medium leading-[1.3] ${T.fg} ${T.hoverAcc} mt-1 transition-colors`}>{item.title}</h3>
                        </article>
                    ))}
                    <div className={`mt-auto pt-5 border-t ${T.line}`}>
                        <a onClick={() => setPage('all-news')} className={`text-[15px] ${T.acc} ${T.hoverFg} cursor-pointer transition-colors`}>{content.news.view_more_button} →</a>
                    </div>
                </div>
            </div>
        </ContentSection>
    );
};


// --- Newsモーダル (Dark Theme) ---
// Lock body scroll while preserving (and restoring) the scroll position.
// Plain `position: fixed` on body causes a jump to top when released — we save the
// scrollY and restore it on unlock to avoid that.
const lockBodyScroll = () => {
    if (document.body.classList.contains('modal-open')) return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.dataset.scrollY = String(scrollY);
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('modal-open');
};
const unlockBodyScroll = () => {
    if (!document.body.classList.contains('modal-open')) return;
    const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    delete document.body.dataset.scrollY;
    // Restore without smooth behavior so it's invisible to the user.
    window.scrollTo(0, scrollY);
};

const NewsModal = ({ newsItem, onClose, ui }) => {
    useEffect(() => {
        if (newsItem) lockBodyScroll(); else unlockBodyScroll();
        return () => unlockBodyScroll();
    }, [newsItem]);

    return (
        <AnimatePresence>
            {newsItem && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-3 md:p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 12, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`${T.surf} border ${T.line} rounded-sm p-6 md:p-10 max-w-3xl w-full relative max-h-[92dvh] flex flex-col`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={onClose} aria-label="Close" className={`absolute top-3 right-3 md:top-5 md:right-5 ${T.muted} ${T.hoverFg} z-10 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center`}><CloseIcon /></button>
                        <div key={newsItem.id || newsItem.title} className="overflow-y-auto custom-scrollbar pr-2 md:pr-6">
                            <p className={`text-[14px] ${T.muted} tabular-nums mb-2`}>{newsItem.date}</p>
                            <h2 className={`text-[24px] md:text-[28px] font-medium ${T.fg} leading-[1.2] mb-6 pr-8`}>{newsItem.title}</h2>
                            <div className={`text-[16px] ${T.body} leading-[1.7] max-w-[64ch]`} dangerouslySetInnerHTML={{ __html: newsItem.fullContent.replace(/\n/g, '<br />') }} />

                            {newsItem.link && (
                                <div className="mt-6">
                                    <a href={newsItem.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 text-[15px] ${T.acc} ${T.hoverFg} transition-colors`}>
                                        <span>{ui ? ui.view_website : 'View website'}</span>
                                        <ExternalLinkIcon className="w-4 h-4" />
                                    </a>
                                </div>
                            )}

                            {newsItem.images && newsItem.images.length > 0 && (
                                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {newsItem.images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`${newsItem.title} ${index + 1}`}
                                            className="w-full h-auto"
                                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


const DetailModal = ({ item, onClose, content, handleDownload, ui }) => {
    useEffect(() => {
        if (item) lockBodyScroll(); else unlockBodyScroll();
        return () => unlockBodyScroll();
    }, [item]);

    const metaLine = item ? [item.year, item.type, item.period].filter(Boolean).join(' · ') : '';
    const asList = (v) => (Array.isArray(v) ? v : [v]).filter(Boolean);

    return (
        <AnimatePresence>
            {item && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-3 md:p-8"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 12, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`${T.surf} border ${T.line} rounded-sm max-w-5xl w-full max-h-[90dvh] flex flex-col md:flex-row relative overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={onClose} aria-label="Close" className={`absolute top-3 right-3 md:top-5 md:right-5 z-20 ${T.muted} ${T.hoverFg} transition-colors ${T.surf} p-2 min-w-[44px] min-h-[44px] flex items-center justify-center`}><CloseIcon /></button>

                        {item.image && (
                            <div className="w-full md:w-1/2 h-52 md:h-auto relative overflow-hidden flex-shrink-0 bg-[#15140f]">
                                <img src={item.image} alt={item.title || item.name} className="w-full h-full object-cover" loading="lazy" decoding="async" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                            </div>
                        )}

                        <div key={item.title || item.name} className={`p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col ${item.image ? 'md:w-1/2' : 'w-full'}`}>
                            {metaLine && <p className={`text-[14px] ${T.muted} mb-2`}>{metaLine}</p>}

                            <h2 className={`text-[22px] md:text-[26px] font-medium ${T.fg} leading-[1.2] mb-5 pr-8`}>{item.title || item.name}</h2>

                            {(item.role || item.funding || item.mentor || item.supports) && (
                                <div className={`mb-5 text-[14px] ${T.muted} flex flex-col gap-1`}>
                                    {item.role && <p><span className={T.fg}>Role</span> · {item.role}</p>}
                                    {asList(item.funding).map((fund, idx) => <p key={`fund-${idx}`}><span className={T.fg}>Funding</span> · {fund}</p>)}
                                    {asList(item.mentor).map((mntr, idx) => <p key={`mentor-${idx}`}><span className={T.fg}>{typeof mntr === 'object' ? mntr.role : 'Mentor'}</span> · {typeof mntr === 'object' ? mntr.name : mntr}</p>)}
                                    {asList(item.supports).map((sup, idx) => <p key={`support-${idx}`}><span className={T.fg}>{sup.role}</span> · {sup.name}</p>)}
                                </div>
                            )}

                            {item.techStack && item.techStack.length > 0 && (
                                <p className={`mb-5 text-[14px] ${T.muted}`}>{item.techStack.join(' · ')}</p>
                            )}

                            {item.prize && (
                                <div className="mb-5">
                                    <p className={`text-[13px] ${T.muted}`}>{item.category === 'grant' ? ui.grant_label : ui.award_label}</p>
                                    <p className={`text-[16px] ${T.acc}`}>{item.prize}</p>
                                </div>
                            )}

                            {item.details && (
                                <p className={`text-[15px] md:text-[16px] ${T.body} whitespace-pre-line leading-[1.7] mb-6`}>{item.details}</p>
                            )}

                            {item.outcomes && item.outcomes.length > 0 && (
                                <div className="mb-6">
                                    <h4 className={`text-[14px] font-medium ${T.fg} mb-2`}>Key outcomes</h4>
                                    <ul className={`list-disc pl-5 space-y-1.5 text-[15px] ${T.body} leading-[1.6]`}>
                                        {item.outcomes.map((outcome, idx) => <li key={idx}>{outcome}</li>)}
                                    </ul>
                                </div>
                            )}

                            {(item.pdf || item.link) && (
                                <div className="flex flex-wrap gap-3 mt-auto pt-2">
                                    {item.pdf && (
                                        <button onClick={(e) => handleDownload(e, item.pdf)} className={`inline-flex items-center gap-2 text-[14px] ${T.fg} border ${T.line} hover:border-[#ede6d6] px-4 py-2 rounded-sm transition-colors`}>
                                            <DownloadIcon className="w-4 h-4" />
                                            <span>{content.research.download_button}</span>
                                        </button>
                                    )}
                                    {item.link && (
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 text-[14px] ${T.fg} border ${T.line} hover:border-[#ede6d6] px-4 py-2 rounded-sm transition-colors`}>
                                            <ExternalLinkIcon className="w-4 h-4" />
                                            <span>{content.activities.site_button}</span>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};



const Footer = ({ content, setPage, ui }) => {
    const scrollToSection = (itemText) => {
        const targetId = itemText.toLowerCase().replace(/\s+/g, '-');

        const externalLinks = {
            'x-(twitter)': 'https://x.com/kazu_koma08',
            'linkedin': 'https://www.linkedin.com/in/kazukoma08/?locale=ja',
            'instagram': 'https://www.instagram.com/kazu.koma08/',
            'facebook': 'https://www.facebook.com/kazu.koma08',
            'github': 'https://github.com/kazueuglena',
            'former-site': 'https://sites.google.com/view/kazuhirokomatsu',
            'advance-lab': 'https://adlab.lne.st/'
        };

        if (externalLinks[targetId]) {
            ReactGA.event({ category: "External_Link", action: "Click", label: targetId });
            window.open(externalLinks[targetId], '_blank', 'noopener,noreferrer');
            return;
        }

        const actualId = targetId === 'Insights' ? 'insights' : targetId;
        setPage('home');
        setTimeout(() => {
            document.getElementById(actualId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <footer className="py-12 md:py-16 relative">
            <div className={CONTAINER}>
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-8 mb-12 border-t ${T.line} pt-10`}>
                    {content.columns.map((column) => (
                        <div key={column.title}>
                            <h3 className={`text-[13px] font-medium ${T.fg} mb-3`}>{column.title}</h3>
                            <ul className="space-y-2">
                                {column.items.map((item) => (
                                    <li key={item}>
                                        <a onClick={() => scrollToSection(item)} className={`text-[14px] ${T.muted} ${T.hoverFg} transition-colors cursor-pointer`}>{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className={`flex flex-col md:flex-row justify-between gap-2 text-[13px] ${T.faint}`}>
                    <p>&copy; {new Date().getFullYear()} Kazuhiro Komatsu</p>
                    <p>{ui.designed_with}</p>
                </div>
            </div>
        </footer>
    );
};

// --- Shared pieces for the "All …" pages ---
const SubPage = ({ children }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`min-h-[100dvh] ${T.fg} relative flex flex-col`}>
        <div className="absolute inset-0 bg-[#15140f]/85 pointer-events-none z-0" />
        <div className={`${CONTAINER} w-full flex-1 pt-28 pb-24 relative z-10`}>
            {children}
        </div>
    </motion.div>
);

const SubPageHeader = ({ title, lang, setLang, onBack, ui }) => (
    <div className={`flex flex-wrap justify-between items-end gap-4 mb-10 border-b ${T.line} pb-4`}>
        <h1 className={`text-[28px] md:text-[34px] font-medium tracking-[-0.01em] ${T.fg}`}>{title}</h1>
        <div className={`flex items-center gap-5 text-[14px] ${T.muted}`}>
            {lang && setLang && (
                <button onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')} className={`${T.hoverFg} flex items-center gap-1.5 transition-colors`}>
                    <GlobeIcon />
                    <span>{lang === 'ja' ? 'EN' : 'JP'}</span>
                </button>
            )}
            <button onClick={onBack} className={`${T.hoverFg} transition-colors`}>← {ui.back}</button>
        </div>
    </div>
);

const Pagination = ({ totalPages, currentPage, paginate }) => (
    totalPages > 1 ? (
        <div className="flex justify-center items-center gap-2 mt-14">
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-9 h-9 rounded-sm text-[14px] tabular-nums transition-colors ${currentPage === i + 1 ? 'bg-[#ede6d6] text-[#15140f]' : `${T.muted} ${T.hoverFg} border ${T.line}`}`}
                >
                    {i + 1}
                </button>
            ))}
        </div>
    ) : null
);

// Image-on-top card used by news / projects / activities lists
const TileCard = ({ image, eyebrow, title, text, onClick, aspect = 'aspect-[4/3]' }) => (
    <article onClick={onClick} className="group cursor-pointer min-w-0">
        {image && (
            <div className={`${aspect} overflow-hidden ${T.surf} mb-3`}>
                <img src={image} alt="" className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90" loading="lazy" decoding="async" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
            </div>
        )}
        {eyebrow && <p className={`text-[14px] ${T.muted} tabular-nums`}>{eyebrow}</p>}
        <h3 className={`text-[17px] font-medium ${T.fg} ${T.hoverAcc} leading-[1.3] mt-1 transition-colors`}>{title}</h3>
        {text && <p className={`text-[14px] ${T.muted} leading-[1.55] mt-1.5`}>{text}</p>}
    </article>
);

const AllProjectsPage = ({ content, setPage, setSelectedDetail, lang, setLang, setScrollToSectionId, ui }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleBack = () => {
        setScrollToSectionId('projects');
        setPage('home');
    };

    const outreachItems = content.projects.items.filter(item => item.category === 'outreach');

    return (
        <SubPage>
            <SubPageHeader title={content.all_projects_page?.title || "Projects"} lang={lang} setLang={setLang} onBack={handleBack} ui={ui} />

            {content.projects.categories && Object.entries(content.projects.categories).map(([categoryKey, categoryData]) => {
                const categoryItems = content.projects.items.filter(item => item.category === categoryKey);
                if (categoryItems.length === 0) return null;

                return (
                    <div key={categoryKey} className="mb-14">
                        <p className={`text-[14px] ${T.muted}`}>{categoryData.period} · {categoryData.status}</p>
                        <h2 className={`text-[22px] md:text-[24px] font-medium ${T.fg} mt-1 mb-6`}>{categoryData.title}</h2>
                        <div className="grid sm:grid-cols-2 gap-8">
                            {categoryItems.map((item, index) => (
                                <TileCard
                                    key={`project-${item.title}-${index}`}
                                    image={item.image}
                                    aspect="aspect-video"
                                    eyebrow={[item.featured && ui.featured_project, item.subProject && 'Sub-project', item.period].filter(Boolean).join(' · ')}
                                    title={item.title}
                                    text={item.description}
                                    onClick={() => setSelectedDetail(item)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            {outreachItems.length > 0 && (
                <div className={`mt-4 pt-10 border-t ${T.line}`}>
                    <h2 className={`text-[22px] md:text-[24px] font-medium ${T.fg}`}>Science Communication &amp; Outreach</h2>
                    <p className={`text-[15px] ${T.muted} mt-1 mb-6`}>Educational activities and social contributions</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {outreachItems.map((item, index) => (
                            <TileCard
                                key={`outreach-${index}`}
                                image={item.image}
                                aspect="aspect-video"
                                title={item.title}
                                text={item.description}
                                onClick={() => setSelectedDetail(item)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </SubPage>
    );
};

const AllNewsPage = ({ content, setPage, setSelectedNews, lang, setLang, setScrollToSectionId, ui }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const sortedItems = [...content.news.items].sort((a, b) => parseNewsDate(b.date) - parseNewsDate(a.date));
    const indexOfLastItem = currentPage * itemsPerPage;
    const currentItems = sortedItems.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => { window.scrollTo(0, 0); }, [currentPage]);

    const handleBack = () => {
        setScrollToSectionId('news');
        setPage('home');
    };

    return (
        <SubPage>
            <SubPageHeader title={content.all_news_page?.title || content.news.title} lang={lang} setLang={setLang} onBack={handleBack} ui={ui} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {currentItems.map((item, index) => (
                    <TileCard
                        key={`news-${index}`}
                        image={item.images && item.images.length > 0 ? item.images[0] : null}
                        eyebrow={item.date}
                        title={item.title}
                        onClick={() => setSelectedNews(item)}
                    />
                ))}
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
        </SubPage>
    );
};


// --- Projects: phase selector, one lead project, the rest as tiles ---
const ProjectSliderSection = ({ content, setSelectedDetail, setPage, ui }) => {
    const allItems = content.projects.items;
    const categories = content.projects.categories;
    const categoryOrder = ['foundation', 'engineering', 'physiology', 'mechanism', 'application', 'vision'];

    const [selectedCategory, setSelectedCategory] = useState('application');

    const categoryItems = useMemo(() => {
        return allItems.filter(item => item.category === selectedCategory);
    }, [allItems, selectedCategory]);

    const isTwoProjects = categoryItems.length === 2;

    const heroProjects = useMemo(() => {
        if (isTwoProjects) return categoryItems;
        return [categoryItems.find(item => item.featured) || categoryItems[0]].filter(Boolean);
    }, [categoryItems, isTwoProjects]);

    const otherItems = useMemo(() => {
        if (isTwoProjects) return [];
        return categoryItems.filter(item => item !== heroProjects[0]);
    }, [categoryItems, heroProjects, isTwoProjects]);

    const selectedCat = categories[selectedCategory];

    return (
        <ContentSection id="projects" title={content.projects.title}>
            {categories && (
                <div className="mb-6 overflow-x-auto scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0">
                    <div className="flex gap-2 min-w-max">
                        {categoryOrder.map((key) => {
                            const cat = categories[key];
                            if (!cat) return null;
                            const isSelected = key === selectedCategory;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setSelectedCategory(key)}
                                    className={`flex flex-col items-start px-4 py-2.5 border rounded-sm text-left transition-colors ${isSelected ? 'border-[#ede6d6] text-[#ede6d6]' : `${T.line} ${T.muted} ${T.hoverFg} hover:border-[#6f6a5c]`}`}
                                >
                                    <span className="text-[12px] tabular-nums">{cat.period}</span>
                                    <span className="text-[14px] font-medium">{cat.title.replace(/ \(.*\)/, '')}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {selectedCat && (
                <p className={`text-[14px] ${T.muted} mb-8`}>
                    {selectedCat.status} · {selectedCat.title} · {categoryItems.length} project{categoryItems.length !== 1 ? 's' : ''}
                </p>
            )}

            <AnimatePresence mode="wait">
                {heroProjects.length > 0 && (
                    <motion.div
                        key={`hero-container-${selectedCategory}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`grid gap-8 mb-10 ${isTwoProjects ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}
                    >
                        {heroProjects.map((heroProject) => (
                            <div
                                key={`hero-${selectedCategory}-${heroProject.title}`}
                                onClick={() => setSelectedDetail(heroProject)}
                                className={`group cursor-pointer grid gap-5 items-start ${isTwoProjects ? '' : 'md:grid-cols-[1.3fr_1fr] md:gap-8'}`}
                            >
                                <div className={`${isTwoProjects ? 'aspect-[4/3]' : 'aspect-[16/10]'} overflow-hidden ${T.surf}`}>
                                    <img
                                        src={heroProject.image}
                                        alt=""
                                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                                        loading="lazy" decoding="async"
                                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-[14px] ${T.muted}`}>{[heroProject.featured && ui.featured_project, heroProject.period].filter(Boolean).join(' · ')}</p>
                                    <h3 className={`text-[22px] md:text-[26px] font-medium leading-[1.2] ${T.fg} ${T.hoverAcc} mt-1.5 mb-3 transition-colors`}>{heroProject.title}</h3>
                                    <p className={`text-[15px] md:text-[16px] ${T.body} leading-[1.6]`}>{heroProject.description}</p>
                                    {heroProject.funding && heroProject.funding.length > 0 && (
                                        <p className={`mt-3 text-[14px] ${T.muted}`}>{heroProject.funding.join(' · ')}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {otherItems.length > 0 && (
                    <motion.div
                        key={`grid-${selectedCategory}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10"
                    >
                        {otherItems.map((item) => (
                            <TileCard
                                key={`proj-${item.title}`}
                                image={item.image}
                                aspect="aspect-video"
                                eyebrow={[item.period, item.role].filter(Boolean).join(' · ')}
                                title={item.title}
                                text={item.description}
                                onClick={() => setSelectedDetail(item)}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`pt-5 border-t ${T.line}`}>
                <a onClick={() => setPage('all-projects')} className={`text-[15px] ${T.acc} ${T.hoverFg} cursor-pointer transition-colors`}>{content.projects.view_all_button} →</a>
            </div>
        </ContentSection>
    );
};


const InsightAccordionCard = ({ item, isExpanded, onToggle, index, ui }) => {
    const cardRef = useRef(null);
    const [folderImages, setFolderImages] = useState([]);

    useEffect(() => {
        if (isExpanded && cardRef.current) {
            setTimeout(() => {
                cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [isExpanded]);

    useEffect(() => {
        if (isExpanded && item.id) {
            fetch(process.env.PUBLIC_URL + '/images/insights/manifest.json')
                .then(r => r.ok ? r.json() : {})
                .then(manifest => {
                    const files = manifest[item.id] || [];
                    setFolderImages(files.map(f =>
                        process.env.PUBLIC_URL + '/images/insights/' + item.id + '/' + f
                    ));
                })
                .catch(() => setFolderImages([]));
        }
    }, [isExpanded, item.id]);

    const metaLine = [item.date, item.tags && item.tags.length > 0 ? item.tags.join(', ') : null].filter(Boolean).join(' · ');

    return (
        <div ref={cardRef} id={`insight-${item.id}`} className={`border-t ${T.line}`}>
            <div onClick={onToggle} className="py-5 md:py-6 cursor-pointer group">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <p className={`text-[14px] ${T.muted} tabular-nums`}>{metaLine}</p>
                        <h3 className={`text-[18px] md:text-[20px] font-medium ${T.fg} ${T.hoverAcc} leading-[1.3] mt-1.5 transition-colors`}>{item.title}</h3>
                        {!isExpanded && item.summary && (
                            <p className={`text-[15px] ${T.body} leading-[1.6] mt-2 max-w-[64ch]`}>{item.summary}</p>
                        )}
                    </div>
                    <ChevronDownIcon isExpanded={isExpanded} />
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-8">
                            <p className={`text-[16px] ${T.body} leading-[1.7] whitespace-pre-line max-w-[64ch]`}>{item.content}</p>

                            {item.link && item.link.trim() !== "" && (
                                <div className="mt-6">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 text-[15px] ${T.acc} ${T.hoverFg} transition-colors`} onClick={(e) => e.stopPropagation()}>
                                        <span>{ui ? ui.view_website : 'View website'}</span>
                                        <ExternalLinkIcon className="w-4 h-4" />
                                    </a>
                                </div>
                            )}

                            {(() => {
                                const allImages = [...folderImages, ...(item.images || [])];
                                return allImages.length > 0 && (
                                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
                                        {allImages.map((img, imgIndex) => (
                                            <img key={imgIndex} src={img} alt={item.title} className="w-full h-auto" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TagFilter = ({ allTags, selectedTag, setSelectedTag, ui }) => {
    const base = 'text-[13px] px-3 py-1 rounded-full border transition-colors';
    const on = 'bg-[#ede6d6] text-[#15140f] border-[#ede6d6]';
    const off = `${T.line} ${T.muted} ${T.hoverFg} hover:border-[#6f6a5c]`;
    return (
        <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedTag(null)} className={`${base} ${!selectedTag ? on : off}`}>{ui?.all || 'All'}</button>
            {allTags.map(tag => (
                <button key={tag} onClick={() => setSelectedTag(tag === selectedTag ? null : tag)} className={`${base} ${selectedTag === tag ? on : off}`}>{tag}</button>
            ))}
        </div>
    );
};

const useInsightTags = (items) => useMemo(() => {
    const tags = new Set();
    items.forEach(item => { if (item.tags) item.tags.forEach(tag => tags.add(tag)); });
    return Array.from(tags).sort();
}, [items]);

const InsightsSection = ({ content, expandedInsightId, onInsightToggle, setPage, ui }) => {
    const [selectedTag, setSelectedTag] = useState(null);
    const allTags = useInsightTags(content.insights.items);

    const sortedInsights = useMemo(() => {
        let items = content.insights.items;
        if (selectedTag) items = items.filter(item => item.tags && item.tags.includes(selectedTag));
        return [...items].sort((a, b) => parseNewsDate(b.date) - parseNewsDate(a.date));
    }, [content.insights.items, selectedTag]);

    return (
        <ContentSection id="insights" title={content.insights.title}>
            <p className={`text-[16px] md:text-[17px] ${T.body} leading-[1.65] max-w-[64ch] whitespace-pre-line mb-6`}>{content.insights.description}</p>

            <div className="mb-8">
                <TagFilter allTags={allTags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} ui={ui} />
            </div>

            <div className={`border-b ${T.line}`}>
                {sortedInsights.slice(0, 3).map((item, index) => (
                    <InsightAccordionCard
                        key={item.id}
                        item={item}
                        index={index}
                        isExpanded={expandedInsightId === item.id}
                        onToggle={() => onInsightToggle(item.id)}
                        ui={ui}
                    />
                ))}
            </div>
            <div className="pt-5">
                <a onClick={() => setPage('all-insights')} className={`text-[15px] ${T.acc} ${T.hoverFg} cursor-pointer transition-colors`}>{content.insights.view_more_button} →</a>
            </div>
        </ContentSection>
    );
};

const AllInsightsPage = ({ content, setPage, expandedInsightId, onInsightToggle, lang, setLang, setScrollToSectionId, ui }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTag, setSelectedTag] = useState(null);
    const itemsPerPage = 9;
    const allTags = useInsightTags(content.insights.items);

    const filteredItems = useMemo(() => {
        let items = content.insights.items;
        if (selectedTag) items = items.filter(item => item.tags && item.tags.includes(selectedTag));
        return [...items].sort((a, b) => parseNewsDate(b.date) - parseNewsDate(a.date));
    }, [content.insights.items, selectedTag]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const currentItems = filteredItems.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => { window.scrollTo(0, 0); }, [currentPage]);
    useEffect(() => { setCurrentPage(1); }, [selectedTag]);

    const handleBack = () => {
        setScrollToSectionId('insights');
        setPage('home');
    };

    return (
        <SubPage>
            <SubPageHeader title={content.insights.title} lang={lang} setLang={setLang} onBack={handleBack} ui={ui} />
            <div className="mb-8">
                <TagFilter allTags={allTags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} ui={ui} />
            </div>
            <div className={`border-b ${T.line}`}>
                {currentItems.map((item, index) => (
                    <InsightAccordionCard
                        key={item.id}
                        item={item}
                        index={index}
                        isExpanded={expandedInsightId === item.id}
                        onToggle={() => onInsightToggle(item.id)}
                        ui={ui}
                    />
                ))}
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
        </SubPage>
    );
};


const MediaRow = ({ item, ui }) => {
    const hasLink = item.link && (typeof item.link === 'string' ? item.link.trim() !== '' : item.link.length > 0);
    const hasImage = item.image && (typeof item.image === 'string' ? item.image.trim() !== '' : item.image.length > 0);
    const href = hasLink ? (Array.isArray(item.link) ? item.link[0] : item.link) : hasImage ? (Array.isArray(item.image) ? item.image[0] : item.image) : null;
    const label = hasLink ? (ui.view_website || 'Read article') : (ui.view || 'View');

    return (
        <article className={`grid md:grid-cols-[200px_1fr] gap-2 md:gap-8 py-5 border-b ${T.line}`}>
            <div className={`text-[14px] ${T.muted} leading-[1.5]`}>
                <p className={`${T.fg} font-medium`}>{item.mediaName}</p>
                <p className="tabular-nums">{[item.type, item.date].filter(Boolean).join(' · ')}</p>
            </div>
            <div className="min-w-0">
                <h3 className={`text-[18px] font-medium ${T.fg} leading-[1.3]`}>{item.title}</h3>
                {item.description && <p className={`text-[15px] ${T.body} leading-[1.6] mt-2 max-w-[64ch]`}>{item.description}</p>}
                {href && (
                    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 mt-3 text-[14px] ${T.acc} ${T.hoverFg} transition-colors`}>
                        {label} <ExternalLinkIcon className="w-3.5 h-3.5" />
                    </a>
                )}
            </div>
        </article>
    );
};

const MediaSection = ({ content, ui, setPage }) => {
    const sortedMedia = [...content.media.items].sort((a, b) => parseNewsDate(b.date) - parseNewsDate(a.date)).slice(0, 3);

    return (
        <ContentSection id="media" title={content.media.title}>
            <div className={`border-t ${T.line}`}>
                {sortedMedia.map((item, index) => <MediaRow key={`media-${index}`} item={item} ui={ui} />)}
            </div>
            <div className="pt-5">
                <a onClick={() => setPage('all-media')} className={`text-[15px] ${T.acc} ${T.hoverFg} cursor-pointer transition-colors`}>{content.news?.view_more_button || "View all"} →</a>
            </div>
        </ContentSection>
    );
};

const AllMediaPage = ({ content, setPage, lang, setLang, setScrollToSectionId, ui }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const sortedItems = [...content.media.items].sort((a, b) => parseNewsDate(b.date) - parseNewsDate(a.date));
    const indexOfLastItem = currentPage * itemsPerPage;
    const currentItems = sortedItems.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => { window.scrollTo(0, 0); }, [currentPage]);

    const handleBack = () => {
        setScrollToSectionId('media');
        setPage('home');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`min-h-[100dvh] ${T.fg} relative flex flex-col`}>
            <div className="absolute inset-0 bg-[#15140f]/85 pointer-events-none z-0" />
            <div className={`${CONTAINER} w-full flex-1 pt-28 pb-16 relative z-10`}>
                <SubPageHeader title={content.media.title} lang={lang} setLang={setLang} onBack={handleBack} ui={ui} />
                <div className={`border-t ${T.line}`}>
                    {currentItems.map((item, index) => <MediaRow key={`all-media-${index}`} item={item} ui={ui} />)}
                </div>
                <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
            </div>
            <div className="relative z-10">
                <Footer content={content.footer} setPage={setPage} ui={ui} />
            </div>
        </motion.div>
    );
};


// --- Main Content Component ---
const MainContent = ({
    lang,
    setLang,
    currentContent,
    setPage,
    scrollToSectionId,
    setScrollToSectionId,
    cvUrl,
    handleNewsSelect,
    expandedInsightId,
    handleInsightToggle,
    setSelectedDetail,
    handleCopyEmail,
    copied
}) => {
    useEffect(() => {
        if (scrollToSectionId) {
            const timer = setTimeout(() => {
                document.getElementById(scrollToSectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setScrollToSectionId(null);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [scrollToSectionId, setScrollToSectionId]);

    return (
        <>
            <Header lang={lang} setLang={setLang} content={currentContent} setPage={setPage} />
            <HeroSection content={currentContent} />

            <ContentSection id="profile" title={currentContent.profile.title}>
                {(() => {
                    const parts = (currentContent.profile.description || '').split('\n\n');
                    const lede = parts[0];
                    const rest = parts.slice(1).join('\n\n');
                    return (
                        <div className="grid md:grid-cols-[160px_1fr] gap-8 md:gap-10 items-start">
                            <div className={`w-[160px] aspect-[4/5] overflow-hidden ${T.surf}`}>
                                <img
                                    src={process.env.PUBLIC_URL + "/images/profile-isef.jpg"}
                                    alt="Kazuhiro Komatsu"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                            <div className="min-w-0">
                                <h3 className={`text-[26px] md:text-[28px] font-medium ${T.fg} leading-tight`}>{currentContent.profile.name}</h3>
                                <p className={`text-[15px] ${T.muted} mt-1 mb-5`}>{currentContent.profile.affiliation}</p>
                                {lede && <p className={`text-[20px] md:text-[22px] leading-[1.4] ${T.fg} max-w-[40ch] mb-4 [text-wrap:balance]`}>{lede}</p>}
                                {rest && <p className={`text-[16px] md:text-[17px] leading-[1.65] ${T.body} whitespace-pre-line max-w-[64ch] mb-6`}>{rest}</p>}
                                <a href={cvUrl} target="_blank" rel="noopener noreferrer" className={`inline-block text-[15px] ${T.acc} ${T.hoverFg} border-b ${T.accBorder} pb-px transition-colors`}>
                                    {currentContent.profile.cv_button}
                                </a>
                            </div>
                        </div>
                    );
                })()}
            </ContentSection>

            <ContentSection id="vision" title={currentContent.vision.title}>
                <div className="max-w-[64ch]">
                    <h3 className={`text-[22px] md:text-[24px] font-medium ${T.fg} leading-snug mb-5`}>{currentContent.vision.heading}</h3>
                    <p className={`text-[16px] md:text-[17px] leading-[1.7] ${T.body} whitespace-pre-line`}>{currentContent.vision.description}</p>
                </div>
            </ContentSection>

            <NewsSection content={currentContent} onNewsSelect={handleNewsSelect} setPage={setPage} ui={currentContent.ui} />

            <ProjectSliderSection
                content={currentContent}
                setSelectedDetail={setSelectedDetail}
                setPage={setPage}
                ui={currentContent.ui}
            />

            <ResearchSection content={currentContent} onDetailSelect={setSelectedDetail} ui={currentContent.ui} />

            <ContentSection id="map" title={currentContent.map.title}>
                <p className={`text-[16px] md:text-[17px] ${T.body} leading-[1.65] max-w-[64ch] mb-8`}>{currentContent.map.description}</p>
                <div className={`relative w-full aspect-video border ${T.line} overflow-hidden`}>
                    <img src={process.env.PUBLIC_URL + "/images/map.jpg"} alt="World map" className="w-full h-full object-contain opacity-70 mix-blend-lighten" loading="lazy" decoding="async" />

                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {currentContent.map.locations.slice(1).map((loc, i) => (
                            <motion.line
                                key={i}
                                x1={`${currentContent.map.locations[0].x}%`} y1={`${currentContent.map.locations[0].y}%`}
                                x2={`${loc.x}%`} y2={`${loc.y}%`}
                                stroke="rgba(237, 230, 214, 0.18)"
                                strokeWidth="1"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: i * 0.15 }}
                            />
                        ))}
                    </svg>

                    {currentContent.map.locations.map((loc, i) => {
                        const isHub = i === 0;
                        return (
                            <div key={loc.id} onClick={() => setSelectedDetail(loc)} className="absolute cursor-pointer group -translate-x-1/2 -translate-y-1/2" style={{ left: `${loc.x}%`, top: `${loc.y}%` }}>
                                <div className="relative flex items-center justify-center">
                                    <div className={`w-3 h-3 rounded-full ${isHub ? 'bg-[#a7b08f]' : 'bg-[#ede6d6]'} group-hover:scale-125 transition-transform duration-200`} />
                                    <div className={`absolute top-3 left-1/2 -translate-x-1/2 text-[12px] ${T.fg} opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${T.bg} px-2 py-0.5`}>
                                        {loc.name}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ContentSection>

            <InsightsSection content={currentContent} expandedInsightId={expandedInsightId} onInsightToggle={handleInsightToggle} setPage={setPage} ui={currentContent.ui} />

            <MediaSection content={currentContent} ui={currentContent.ui} setPage={setPage} />

            <ContentSection id="activities" title={currentContent.activities.title}>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
                    {currentContent.activities.items.map((item, index) => (
                        <TileCard
                            key={`activity-${index}`}
                            image={item.image}
                            eyebrow={item.year}
                            title={item.title}
                            text={item.event}
                            onClick={() => setSelectedDetail(item)}
                        />
                    ))}
                </div>
            </ContentSection>

            <ContentSection id="contact" title={currentContent.contact.title}>
                <div className="max-w-[64ch]">
                    <p className={`text-[16px] md:text-[17px] ${T.body} leading-[1.65] whitespace-pre-line mb-8`}>{currentContent.contact.description}</p>
                    <button onClick={handleCopyEmail} className="group inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 text-left">
                        <span className={`text-[20px] md:text-[24px] font-medium ${T.fg} ${T.hoverAcc} transition-colors break-all`}>{currentContent.contact.email}</span>
                        <span className={`text-[13px] ${copied ? T.acc : T.muted}`}>{copied ? currentContent.ui.copied : currentContent.ui.copy}</span>
                    </button>

                    <div className={`flex gap-6 mt-8 ${T.muted}`}>
                        <a href="https://x.com/kazu_koma08" target="_blank" rel="noopener noreferrer" aria-label="X" className={`${T.hoverFg} transition-colors`} onClick={() => ReactGA.event({ category: "External_Link", action: "Click", label: "x-(twitter)" })}><TwitterIcon /></a>
                        <a href="https://www.instagram.com/kazu.koma08/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={`${T.hoverFg} transition-colors`} onClick={() => ReactGA.event({ category: "External_Link", action: "Click", label: "instagram" })}><InstagramIcon /></a>
                        <a href="https://www.facebook.com/kazu.koma08" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`${T.hoverFg} transition-colors`} onClick={() => ReactGA.event({ category: "External_Link", action: "Click", label: "facebook" })}><FacebookIcon /></a>
                        <a href="https://www.linkedin.com/in/kazukoma08/?locale=ja" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`${T.hoverFg} transition-colors`} onClick={() => ReactGA.event({ category: "External_Link", action: "Click", label: "linkedin" })}><LinkedinIcon /></a>
                        <a href="https://github.com/kazueuglena" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={`${T.hoverFg} transition-colors`} onClick={() => ReactGA.event({ category: "External_Link", action: "Click", label: "github" })}><GitHubIcon /></a>
                    </div>
                </div>
            </ContentSection>


            <Footer content={currentContent.footer} setPage={setPage} ui={currentContent.ui} />
        </>
    );
};

// --- メインアプリケーションコンポーネント ---
export default function App() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [lang, setLangState] = useState(() => {
        const urlLang = searchParams.get('lang');
        if (urlLang === 'en' || urlLang === 'ja') return urlLang;

        const savedLang = localStorage.getItem('appLang');
        if (savedLang === 'en' || savedLang === 'ja') return savedLang;

        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && !browserLang.startsWith('ja')) return 'en';

        return 'ja';
    });

    const setLang = useCallback((newLang) => {
        setLangState(newLang);
        localStorage.setItem('appLang', newLang);
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('lang', newLang);
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    useEffect(() => {
        const urlLang = searchParams.get('lang');
        if (urlLang === 'en' || urlLang === 'ja') {
            if (urlLang !== lang) {
                setLangState(urlLang);
                localStorage.setItem('appLang', urlLang);
            }
        } else {
            setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                next.set('lang', lang);
                return next;
            }, { replace: true });
        }
    }, [searchParams, lang, setSearchParams]);

    const [page, setPageState] = useState(() => {
        const urlView = searchParams.get('v');
        if (urlView === 'news') return 'all-news';
        if (urlView === 'projects') return 'all-projects';
        if (urlView === 'insights') return 'all-insights';
        if (urlView === 'media') return 'all-media';
        return 'home';
    });

    const setPage = useCallback((newPage) => {
        setPageState(newPage);
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (newPage === 'home') {
                next.delete('v');
            } else if (newPage === 'all-news') {
                next.set('v', 'news');
            } else if (newPage === 'all-projects') {
                next.set('v', 'projects');
            } else if (newPage === 'all-insights') {
                next.set('v', 'insights');
            } else if (newPage === 'all-media') {
                next.set('v', 'media');
            }
            return next;
        });
    }, [setSearchParams]);

    useEffect(() => {
        const urlView = searchParams.get('v');
        let expectedPage = 'home';
        if (urlView === 'news') expectedPage = 'all-news';
        else if (urlView === 'projects') expectedPage = 'all-projects';
        else if (urlView === 'insights') expectedPage = 'all-insights';
        else if (urlView === 'media') expectedPage = 'all-media';

        setPageState(expectedPage);
    }, [searchParams]);
    const [selectedNews, setSelectedNews] = useState(null);
    const [_selectedDetail, _setSelectedDetail] = useState(null);
    const selectedDetail = _selectedDetail;

    const setSelectedDetail = useCallback((item) => {
        if (!item) {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.delete('p');
                newParams.delete('a');
                newParams.delete('m');
                return newParams;
            });
            _setSelectedDetail(null);
            return;
        }

        let type = null;
        if (item.x !== undefined && item.y !== undefined) {
            type = 'm';
        } else if (item.event !== undefined) {
            type = 'a';
        } else if (item.category && ['foundation', 'engineering', 'physiology', 'mechanism', 'application', 'vision', 'outreach'].includes(item.category)) {
            type = 'p';
        }

        if (type && item.id) {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set(type, item.id);
                return newParams;
            });
        }
        _setSelectedDetail(item);
    }, [setSearchParams]);

    const [showIntro, setShowIntro] = useState(() => {
        // Check session storage to see if intro has been shown
        return !sessionStorage.getItem('introShown');
    });
    const [expandedItem, setExpandedItem] = useState(null);
    const [copied, setCopied] = useState(false);
    const [scrollToSectionId, setScrollToSectionId] = useState(null);
    const [expandedInsightId, setExpandedInsightId] = useState(null);

    useEffect(() => {
        ReactGA.initialize('G-CQ3EC5TLMM');
    }, []);

    useEffect(() => {
        const currentPath = `/${page}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        ReactGA.send({ hitType: "pageview", page: currentPath, title: page });
    }, [page, searchParams]);

    const currentContent = content[lang];
    const cvUrl = "https://drive.google.com/file/d/1LUlTviJPBxVjce3lwcg-6IDZ1YOTdDn9/view?usp=sharing";

    // --- News Routing Logic ---
    const handleNewsSelect = (item) => {
        if (item && item.id) {
            setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                next.set('n', item.id);
                return next;
            });
        } else {
            setSelectedNews(item); // Fallback for items without ID
        }
    };

    const handleNewsClose = () => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.delete('n');
            return newParams;
        });
    };

    // Sync URL -> State
    useEffect(() => {
        const newsId = searchParams.get('n');
        if (newsId) {
            const allItems = content[lang].news.items;
            const item = allItems.find(i => i.id === newsId);
            if (item) {
                setSelectedNews(item);
            }
        } else {
            // Only clear if currently selected to avoid flickering or loops if handled elsewhere
            // But since URL is truth, we should clear.
            // Check if selectedNews is actually open to avoid unnecessary updates?
            // Actually, simply:
            setSelectedNews(null);
        }
    }, [searchParams, lang, content]);

    // Sync URL -> selectedDetail (Projects, Activities, Map)
    useEffect(() => {
        const projectId = searchParams.get('p');
        const activityId = searchParams.get('a');
        const mapId = searchParams.get('m');

        if (projectId) {
            const item = content[lang].projects.items.find(i => i.id === projectId);
            if (item) _setSelectedDetail(item);
        } else if (activityId) {
            const item = content[lang].activities.items.find(i => i.id === activityId);
            if (item) _setSelectedDetail(item);
        } else if (mapId) {
            const item = content[lang].map.locations.find(i => i.id === mapId);
            if (item) _setSelectedDetail(item);
        } else {
            // Close modal if no URL params match, but ONLY if we are showing a project/activity/map.
            _setSelectedDetail((prev) => {
                if (prev && prev.id) return null;
                return prev;
            });
        }
    }, [searchParams, lang, content]);

    // --- Insight Accordion + URL Routing ---
    const handleInsightToggle = (insightId) => {
        if (expandedInsightId === insightId) {
            // Collapse: remove hash
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
            setExpandedInsightId(null);
        } else {
            // Expand: set hash to insightId
            window.history.replaceState(null, '', window.location.pathname + window.location.search + '#' + insightId);
            setExpandedInsightId(insightId);
        }
    };

    // Sync URL -> Accordion expand state for Insights
    useEffect(() => {
        const syncHash = () => {
            const hash = window.location.hash.replace('#', '');
            const allInsightIds = content[lang].insights.items.map(i => i.id);
            if (hash && allInsightIds.includes(hash)) {
                setExpandedInsightId(hash);
            } else {
                setExpandedInsightId(null);
            }
        };
        syncHash();
        window.addEventListener('hashchange', syncHash);
        return () => window.removeEventListener('hashchange', syncHash);
    }, [lang, content]);

    const handleCopyEmail = () => {
        ReactGA.event({
            category: "Contact",
            action: "Copy_Email"
        });
        const textArea = document.createElement("textarea");
        textArea.value = currentContent.contact.email;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Email copy failed', err);
        }
        document.body.removeChild(textArea);
    };

    const handleDownload = (e, pdfPath) => {
        e.stopPropagation();
        ReactGA.event({
            category: "Engagement",
            action: "Download_CV",
            label: pdfPath
        });
        const link = document.createElement('a');
        link.href = pdfPath;

        const filename = pdfPath.substring(pdfPath.lastIndexOf('/') + 1);
        link.setAttribute('download', filename);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    return (
        <div className="bg-[#15140f] text-[#ede6d6] relative selection:bg-[#a7b08f]/30 selection:text-[#ede6d6] min-h-[100dvh]">

            <AnimatePresence>
                {showIntro && <NodeIntro onFinish={() => {
                    setShowIntro(false);
                    sessionStorage.setItem('introShown', 'true');
                }} />}
            </AnimatePresence>

            {/* Fixed Background - Always Visible */}
            {!showIntro && <BotanicalSynapse />}

            <AnimatePresence mode="wait">
                {!showIntro && (
                    <motion.div key={page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="relative z-10">
                        <NewsModal newsItem={selectedNews} onClose={handleNewsClose} ui={currentContent.ui} />

                        <DetailModal item={selectedDetail} onClose={() => setSelectedDetail(null)} content={currentContent} handleDownload={handleDownload} ui={currentContent.ui} />
                        {page === 'home' && (
                            <MainContent
                                lang={lang}
                                setLang={setLang}
                                currentContent={currentContent}
                                setPage={setPage}
                                scrollToSectionId={scrollToSectionId}
                                setScrollToSectionId={setScrollToSectionId}
                                cvUrl={cvUrl}
                                handleNewsSelect={handleNewsSelect}
                                expandedInsightId={expandedInsightId}
                                handleInsightToggle={handleInsightToggle}
                                setSelectedDetail={setSelectedDetail}
                                handleCopyEmail={handleCopyEmail}
                                copied={copied}
                            />
                        )}
                        {page === 'all-news' && <AllNewsPage content={currentContent} setPage={setPage} setSelectedNews={handleNewsSelect} lang={lang} setLang={setLang} setScrollToSectionId={setScrollToSectionId} ui={currentContent.ui} />}
                        {page === 'all-projects' && <AllProjectsPage content={currentContent} setPage={setPage} setSelectedDetail={setSelectedDetail} lang={lang} setLang={setLang} setScrollToSectionId={setScrollToSectionId} ui={currentContent.ui} />}
                        {page === 'all-insights' && <AllInsightsPage content={currentContent} setPage={setPage} expandedInsightId={expandedInsightId} onInsightToggle={handleInsightToggle} lang={lang} setLang={setLang} setScrollToSectionId={setScrollToSectionId} ui={currentContent.ui} />}
                        {page === 'all-media' && <AllMediaPage content={currentContent} setPage={setPage} lang={lang} setLang={setLang} setScrollToSectionId={setScrollToSectionId} ui={currentContent.ui} />}
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Global styles live in index.css */}
        </div>
    );
}
//test