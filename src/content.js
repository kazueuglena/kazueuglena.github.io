import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';


// --- News Image Context ---
const newsContext = require.context('./assets/images_news', true, /\.(png|jpe?g|svg)$/i);
const getNewsImages = (folderName) => {
    return newsContext.keys()
        .filter(key => key.includes(`/${folderName}/`))
        .map(key => newsContext(key));
};

// --- 多言語コンテンツ ---
const content = {
    ja: {
        nav: { profile: "Profile", vision: "Vision", news: "News", research: "Research", projects: "Projects", map: "Map", activities: "Activities", contact: "Contact" },
        ui: {
            read_more: "READ MORE",
            click_for_details: "詳細を見る",
            featured_project: "FEATURED PROJECT",
            back: "BACK",
            award_label: "AWARD",
            grant_label: "GRANT",
            copy: "COPY EMAIL",
            click_to_copy: "Click to Copy",
            copied: "COPIED",
            view: "VIEW",
            designed_with: "Designed with Botanical Intelligence.",
            back_to_main: "Back to Main Page",
            scroll: "SCROLL",
            view_website: "ウェブサイトを見る"
        },
        hero: {
            title: "Intelligence is Connection",
            subtitle: "知性は、つながりの中に。",
            name_label: "Kazuhiro Komatsu | Student"
        },
        profile: {
            title: "Profile",
            name: "小松 和滉",
            affiliation: "長野県諏訪清陵高等学校 | 次世代研究所 ADvance Lab 副所長",
            description: "異なる領域が繋がることでこそ、新たな「知」が生まれると信じています。\n\n私は、長野県を拠点に「生物学×情報工学」という学際的な視点からオジギソウの研究に取り組むとともに、地方と都市の教育格差を解消するための科学教育活動を展開してきました。\n研究室の知見と社会の課題、最先端のテクノロジーと地方の子どもたち。それら分断されがちな世界を滑らかにつなぐ「架け橋」となることで、新たな可能性を拓いていきます。",
            cv_button: "CVを見る"
        },
        vision: {
            title: "Vision",
            heading: "知性の定義を、拡張する。",
            description: "これまで知性とは、脳や神経系を持つ動物だけの特権であるとされてきました。\n\nしかし私は、知性は、特定の器官に宿るのではなく、無数の要素が相互作用する「ネットワーク（つながり）」そのものに創発する現象だと考えています。植物は、脳という中央処理装置を持たない代わりに、全身に広がる分散的なネットワークを用いて高度な情報処理を行っています。この事実は、知性が必ずしも神経系を必要としない可能性を示しています。私は植物の研究を通じて、知性の定義を「構造」から「システム」へと拡張し、生命が持つ知の普遍性を明らかにすることを目指しています。",
        },
        news: {
            title: "News",
            items: [
                {
                    id: "new-website",
                    date: "2025.07.15",
                    title: "ポートフォリオサイトを大幅リニューアル",
                    summary: "インタラクティブな機能を追加し、ウェブサイトを全面的に更新しました。",
                    fullContent: "本日、ポートフォリオサイトを大幅にリニューアルしました。これまでの活動内容の拡充に加え、新たにNewsセクション、インタラクティブな活動マップなどを追加しました。これにより、私の活動の現在・過去・未来をより深く、そして楽しく知っていただけるようになったと信じています。ぜひサイト内を探索してみてください。<br><br><a href='https://sites.google.com/view/kazuhirokomatsu' target='_blank' rel='noopener noreferrer' class='text-emerald-500 hover:underline'>以前のサイトはこちら</a>",
                    images: getNewsImages("new_website")
                },
                {
                    id: "acmb-jsmb-2025",
                    date: "2025.07.11",
                    title: "ACMB-JSMB2025にてポスター発表",
                    summary: "ACMB-JSMB2025にて、植物の刺激馴化メカニズムに関する研究成果をポスター発表しました。",
                    fullContent: "ACMB-JSMB2025（Asian Conference on Mathematical Biology と Annual Meeting of Japanese Society for Mathematical Biology の合同会議）にて、私の研究テーマであるオジギソウの刺激馴化メカニズムに関するポスター発表を行いました。この合同会議は、数理生物学の分野におけるアジア地域および日本の最先端の研究が一堂に会する重要な学術イベントです。\n発表では、植物が環境刺激にどのように適応し、その応答を変化させるのかというメカニズムについて、数理的なアプローチやモデル構築を通じて得られた新たな知見を共有しました。特に、オジギソウの「記憶」とも言える刺激馴化現象を、数理モデルを用いて解析した成果について、参加された研究者の方々と活発な議論を行うことができ、非常に有意義な時間となりました。",
                    images: getNewsImages("ACMBJSMB")
                },
                {
                    id: "asc-2025",
                    date: "2025.08.07",
                    title: "Asian Science Camp 2025に参加",
                    summary: "ノーベル賞受賞者を含めた数多くの研究者の方やアジア各国からの高校生大学生参加者と交流しました。",
                    fullContent: "2025年7月31日から8月6日にかけてタイで開催された、Asian Science Camp 2025 (ASC2025) に、日本代表団の一員として参加しました。本キャンプは、ノーベル賞受賞者や世界のトップレベルの研究者による講演、そしてアジア各国から選抜された高校生・大学生との交流を通じて、次世代の科学者を育成することを目的とした国際的なプログラムです。\n期間中は、多岐にわたる科学分野の講演聴講に加え、講師や参加者を交えたディスカッション、グループでのポスターセッションに参加しました。各国の参加者との議論を通じて、多様な科学的視点やアプローチに触れることができ、大変有意義な時間となりました。本キャンプで得た国際的な経験と知見を、今後の自身の研究活動に活かしていきたいと考えています。",
                    images: getNewsImages("ASC2025")
                },
                {
                    id: "expo-workshop-announce",
                    date: "2025.08.11",
                    title: "【告知】8/24 大阪万博にてWS開催",
                    summary: "植物に関するワークショップを8月24日に大阪・関西万博2025「いのちの遊び場 クラゲ館」にて行います。",
                    fullContent: "来る2025年8月24日（日）、大阪・関西万博のパビリオン「いのちの遊び場 クラゲ館」にて、私が企画・案内するワークショップ『植物と人がともに紡ぐ共生の風景　ー触って学ぶ植物の能力』を開催します。\n\nこの企画は、植物が持つ驚くべき能力を、見て、触れて、直感的に体験していただく参加型のイベントです。会場内には「オジギソウ触れ合い」「就眠運動観察」「電気信号可視化」など、私の研究に基づいた5つのステーションを設置します。参加者の皆様には、これらのステーションを自由に巡りながら植物の神秘を発見し、人と植物が共創する未来のビジョンを一緒に描いていきたいと考えています。\n\n皆様のご来場を心よりお待ちしております。\n\n【開催概要】\n■日時: 2025年8月24日（日） 10:15 - 13:15\n■場所: 大阪・関西万博2025 いのちの遊び場 クラゲ館「いのちのゆらぎ場」\n■参加方法: 予約不要（先着順となります）\n\n※状況により、内容の変更や中止となる可能性があります。予めご了承ください。",
                    images: getNewsImages("Expo2025")
                },
                {
                    id: "expo-workshop-report",
                    date: "2025.08.24",
                    title: "大阪・関西万博2025にてワークショップを開催しました",
                    summary: "大阪・関西万博のパビリオン『いのちの遊び場 クラゲ館』にて、オジギソウをテーマにした科学ワークショップを企画・開催しました。",
                    fullContent: "2025年8月24日、大阪・関西万博のパビリオン「いのちの遊び場 クラゲ館」にて、私が企画・案内するワークショップ『植物と人がともに紡ぐ共生の風景　ー触って学ぶ植物の能力』を無事開催いたしました。<br><br>このワークショップは、私の研究テーマであるオジギソウの不思議な能力を通して、子どもから大人まで多くの皆さんに科学の面白さを体験してもらうことを目的としたものです。世界中から人々が集まるこの特別な場所で、このような機会を頂けたことに心から感謝しています。<br><br>当日は、植物の能力を直感的に体験できる5つのステーションを用意しました。特に「オジギソウ触れ合いステーション」では、実際に触れると葉を閉じる様子に、子どもたちから大きな驚きと歓声が上がりました。「なぜ動くの？」「どうなってるの？」と輝く目で質問してくれる姿を見て、科学の種を未来に届けられた手応えを感じ、非常に感動的な一日となりました。<br><br>今回の経験は、自身の研究内容を社会に還元することの重要性と喜びを改めて教えてくれました。この貴重な学びを、今後の研究活動はもちろん、長野での「サイエンス出前便」などの科学教育プロジェクトにも活かしていきたいと思います。<br><br>最後になりましたが、ご来場いただいた皆様、そして開催にあたり多大なるご支援をいただいた万博関係者の皆様、クラゲ館スタッフの皆様に、心より御礼申し上げます。",
                    images: getNewsImages("expo_workshop")
                },
                {
                    id: "jbs-2025",
                    date: "2025.09.20",
                    title: "第89回日本植物学会 高校生ポスター発表にて発表&受賞",
                    summary: "日本植物学会にてポスター発表を行いました。多くの研究者の方々と議論でき、大変貴重な経験となりました。",
                    fullContent: "2025年9月20日（土）、福岡国際会議場で開催された「第89回日本植物学会」の高校生ポスター発表部門に参加しました。<br><br>本学会は、日本の植物科学研究における最大級の学術集会の一つです。今回は、新たに構築した実験系から得られた最新のデータを基に、自身の研究成果を発表しました。<br><br>当日は、ポスターセッションを通じて、国内外の第一線で活躍される多くの研究者の方々と直接議論を交わす機会に恵まれました。当日は4時間にわたりディスカッションを行い、自身の研究に対する多角的なフィードバックや、今後の研究の発展に繋がる貴重な助言をいただくことができ、大変有意義な時間となりました。<br><br>その結果、幸運にもポスター発表に対して賞をいただくことができました。この受賞を励みに、今後もさらなる探究を進めてまいります。<br><br>ご指導いただいた先生方、並びに当日ブースにて熱心に議論してくださった皆様に、この場を借りて心より御礼申し上げます。",
                    images: getNewsImages("JBS2025")
                },
                {
                    id: "rohto-future-2025",
                    date: "2025.09.28",
                    title: "ロート製薬・リバネス共創プロジェクトにて未来提案プレゼンを実施",
                    summary: "2100年における精神疾患に対する解決策を大阪駅前で発表しました。",
                    fullContent: "2025年9月28日（日）、大阪駅前の「グラングリーン大阪」にて開催された、ロート製薬株式会社様と株式会社リバネス様が共催するプロジェクト成果報告会にてプレゼンテーションを行いました。<br><br>本プロジェクトは、大阪・関西万博を契機に、高校生が未来の社会課題を探究し「未来の研究テーマ」を創出することを目的としたものです。私はチームの一員として「2100年における精神疾患」という壮大なテーマに2ヶ月以上にわたって取り組みました。<br><br>発表に至るまで、チームでのオンラインディスカッションを重ねたほか、実際に大阪万博にも足を運び、未来の医療や社会に対する知見を深めました。当日は、これまで練り上げてきたアイデアを発表できただけでなく、他のチームの提案についても活発なディスカッションを行い、大変充実した時間となりました。<br><br>今回のプロジェクトを通じて、これまで取り組んできたオジギソウや数理モデルといった基礎研究の知見を、いかにして社会実装に繋げるかという応用科学の視点を強く意識するようになりました。これは私自身の研究者としてのキャリアを考える上で、非常に大きな転機となる貴重な経験です。<br><br>このような素晴らしい機会をくださったロート製薬株式会社の皆様、株式会社リバネスの皆様、共に探究を深めたチームメンバー、そして関係者の皆様に心より感謝申し上げます。",
                    images: getNewsImages("RohtoFuture2025")
                },
                {
                    id: "nagano-gakkasyo2025",
                    date: "2025.10.04",
                    title: "長野県学生科学賞にて県知事賞を受賞",
                    summary: "オジギソウの「馴化様」現象を画像解析技術を用いて解明した研究により、最高賞である長野県知事賞を受賞しました。",
                    fullContent: "2025年10月に行われた長野県学生科学賞の審査会において、私の研究プロジェクトが最高賞にあたる「県知事賞」を受賞いたしました。<br><br>研究テーマは『植物は刺激を学習するのか -オジギソウの特定の刺激に対する馴化の定量的解析』です。植物が繰り返される刺激に対して反応しなくなる「馴化（慣れ）」という現象は、植物における原始的な「記憶・学習」能力として注目されています。<br><br>本研究の鍵となったのは、これまで目視や単純な計測に頼っていた植物の挙動を、高精度な「画像」データとして捉え直した点です。自作の撮影装置と解析プログラムを駆使し、葉の開閉運動を数値化・可視化することで、これまで曖昧だったオジギソウの応答調節能力を定量的に示すことに成功しました。<br><br>生物学的な観察と、情報工学的な解析手法を「繋ぐ」このアプローチが評価されたことは、私にとって大きな自信となりました。<br><br>今後は、この長野県代表として進む日本学生科学賞（中央審査）に向けて、さらなるデータ検証と論理の精査を進めてまいります。日頃より熱心にご指導いただいている先生方、議論を交わした友人、そして研究活動を支えてくださる全ての皆様に心より感謝申し上げます。",
                    images: getNewsImages("NaganoGakkasyo2025")
                },
                {
                    id: "UTokyoGSC-seika",
                    date: "2025.11.15",
                    title: "UTokyoGSC-NEXT 第3段階 成果発表会にて研究成果を発表",
                    summary: "東京大学・末次研究室での指導のもと取り組んだオジギソウの研究成果を発表。多くの刺激を受けました。",
                    fullContent: "2025年11月15日、東京大学グローバルサイエンスキャンパス（UTokyoGSC-Next）の第3段階成果発表会に参加しました。私は東京大学の末次憲之先生の研究室にてご指導いただき、研究活動を行ってきましたが、今回はその一区切りとなる集大成の発表でした。<br><br>私の研究テーマである「オジギソウの馴化」について、末次研究室の高度な環境で得られた知見と、自作システムによる「画像」解析の結果を交えてプレゼンテーションを行いました。<br><br>当日は、共に第3段階を走り抜けた仲間の発表に加え、これから本格的な研究に入る第2段階生のユニークで面白い研究計画も聞くことができ、その発想の豊かさに驚かされました。学年や段階を超えて科学への情熱を「繋ぐ」交流の場に参加できたことは、私にとって大きな財産です。<br><br>末次先生をはじめ、研究室の皆様、そして事務局の方々に深く感謝いたします。ここで得た経験を糧に、今後も研究活動に邁進していきます。",
                    images: getNewsImages("UTokyoGSC")
                },
                {
                    id: "koushien",
                    date: "2025.11.29",
                    title: "科学の甲子園 長野県予選にて準優勝（実技部門1位）",
                    summary: "生物担当としてチームに貢献。実技競技では全体1位を獲得しましたが、惜しくも総合2位で全国大会出場はなりませんでした。",
                    fullContent: "2025年11月29日、「科学の甲子園」長野県予選に学校代表チームの一員（生物担当）として出場しました。<br><br>結果は、県内総合2位。優勝チームのみに与えられる全国大会への切符には、あと一歩届きませんでした。<br><br>筆記競技で点数を伸ばしきれなかった悔しさは残りますが、チームワークが試される「実技競技」においては、全体1位という最高の結果を残すことができました。専門分野の異なるメンバーが知恵を出し合い、課題解決に取り組んだプロセスは非常に濃密な時間でした。<br><br>また、競技を通じて県内の他の高校の科学好きの生徒たちと交流し、学校の枠を超えて「繋がる」ことができたのは大きな収穫です。ここで得たネットワークと、あと少しで届かなかった悔しさをバネに、個人の研究活動でもさらに高みを目指していきたいと思います。",
                    images: getNewsImages("Koushien")
                },
                {
                    id: "mbsj-2025",
                    date: "2025.12.05",
                    title: "第48回日本分子生物学会年会にてポスター発表",
                    summary: "パシフィコ横浜で開催された国内最大級の学会にて、オジギソウとヒドラに関する2つの研究成果を発表しました。",
                    fullContent: "2025年12月5日、パシフィコ横浜で開催された「第48回日本分子生物学会年会」の高校生発表部門に参加しました。<br><br>今回は2つのテーマについて発表を行いました。1つ目は、自身のメインテーマである「オジギソウの刺激馴化」についてで、特に数理モデルを用いた解析結果を中心に発表しました。2つ目は、学校の課題研究として友人と共同で取り組んでいる「ヒドラ」に関する研究です。<br><br>会場は非常に大きく、その規模に圧倒されましたが、自分の研究分野と近いセッションもあり、最先端の知見に触れることができ大変勉強になりました。多くの専門家の方々と議論できたことは大きな財産です。",
                    images: getNewsImages("MBSJ2025")
                },
                {
                    id: "sc-world-2025",
                    date: "2025.12.13",
                    title: "サイエンスキャッスルワールド2025にて発表",
                    summary: "東京科学大学で開催された研究発表会に参加。受賞は逃しましたが、国内外の仲間との貴重な交流の機会となりました。",
                    fullContent: "2025年12月13日、東京科学大学（旧東京工業大学）にて開催された「サイエンスキャッスルワールド 2025」にポスター発表で参加しました。<br><br>今回は残念ながら受賞には至りませんでしたが、それ以上に得難い経験をすることができました。特にかねてよりお話ししたいと思っていた先輩と直接お会いできたことや、海外からの参加者と英語でディスカッションできたことは、自分にとって大きな刺激となりました。<br><br>また、これまでの科学活動を通じて親交のあった友人たちとも再会し、互いの研究や近況について語り合うことができました。結果以上に、研究を通じた「人との繋がり」を強く実感する、大変素晴らしい機会となりました。",
                    images: getNewsImages("SCWorld2025")
                },
                {
                    id: "Gakkasyo-2025",
                    date: "2025.12.19",
                    title: "【速報】日本学生科学賞にて大臣賞受賞 & ISEF出場決定",
                    summary: "日本学生科学賞にて「科学技術政策担当大臣賞」を受賞し、世界大会ISEFへの出場権を獲得しました。秋篠宮皇嗣殿下や小野田大臣より激励のお言葉を賜りました。",
                    fullContent: "第69回日本学生科学賞の中央表彰式にて、「科学技術政策担当大臣賞」（全国5位相当）を受賞いたしました。また、これにより来年5月にアメリカで開催される世界最大の学生科学コンテスト「ISEF（国際学生科学技術フェア）」への日本代表派遣が決定しました。\n\n今回は優れた研究が数多くある中で選出いただき、運や巡り合わせにも恵まれたと感じています。また、現状の評価には「高校生である」というある種の加点が含まれていると自覚しています。今後はそうした枠組みを超え、一人の「研究者」として純粋に研究内容で評価されるよう、より一層精進したいという決意を新たにしました。\n\n式典後には、秋篠宮皇嗣殿下と懇談させていただく機会を賜りました。研究内容についてのご質問や背中を押していただくお言葉をいただき、大変励みになりました。また、小野田内閣府特命担当大臣（科学技術政策担当）とも握手をさせていただき、研究について直接お話しすることができました。\n\n会場で出会った同世代の優れた研究者たちとの繋がりも、私にとって大きな財産です。この縁を大切にしながら、世界の舞台でも全力を尽くしてきます。",
                    images: getNewsImages("Gakkasyo-2025")
                },
                {
                    id: "ABA-Symposium-2026",
                    date: "2026.01.14",
                    title: "【香港】第12回アジア生物物理学会にて口頭発表・ポスター発表",
                    summary: "香港で開催されたABA Symposiumに参加し、英語でのポスター発表と自身初となる口頭発表を行いました。高校生ながら挑戦の機会をいただき、生物物理学の面白さと、海外単独渡航を通じた個人の成長を実感しました。",
                    fullContent: "1月12日・13日に香港科技大学で開催された「The 12th Asian Biophysics Association (ABA) Symposium」に参加しました。今回は英語でのポスター発表に加え、自身初となるOral Presentation（口頭発表）にも挑戦しました。\n\n採択から本番までの期間が極めて短く、前日の夜まで原稿が完成しないという過酷な状況でしたが、いざ本番では「自分の研究を伝えたい」という熱意が勝り、自分でも驚くほどスムーズに発表を行うことができました（同時に、基礎的な英語力の不足も痛感しました）。\n\n学会では、膜タンパク質の専門家など今後の研究に不可欠な先生方と繋がることができました。これまでのマクロ的なアプローチに加え、今後は刺激受容センサー（膜タンパク）というミクロな視点も取り入れて研究を深化させていきます。生物物理学という分野の面白さに触れられたことも大きな収穫でした。\n\nまた、今回は完全な単独渡航でした。準備不足が災いし、ホテルや航空券の手配で深刻なトラブルに見舞われましたが、その分、周囲のサポートのありがたさを痛感しました。エキゾチックな香港の文化に触れ、研究者としてだけでなく、人としても一回り成長できた気がします。\n\n分野外かつ高校生の私を口頭発表に採択してくださった事務局の皆様、ご支援いただいた日本科学協会様、そしてトラブルの際に助けてくれた家族（特に母）に心から感謝申し上げます。",
                    images: getNewsImages("ABA-Symposium-2026"),
                    link: "https://xiiaba.hkust.edu.hk/"
                },
                /*
                {
                    id: "-",
                    date: "2025.XX.XX",
                    title: "-",
                    summary: "-",
                    fullContent: "-",
                    images: getNewsImages("-")
                }
                */
            ],
            view_more_button: "VIEW ALL",
            details_button: "詳細"
        },
        research: {
            title: "Research",
            heading_grants: "研究助成・競争的資金",
            heading_awards: "研究発表・学会",
            description: "オジギソウの応答調節の検証や数理的解析、ヒドラの古典的条件付けなどの様々な研究を進めています。",
            grants: [
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
                    year: "2025",
                    title: "第69回 日本学生科学賞（高等学校の部）",
                    prize: "-",
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
            view_all_button: "VIEW ALL",
            items: [
                { image: process.env.PUBLIC_URL + "/images/mimosa2.png", title: "オジギソウの応答調節（馴化）の機構解明", description: "オジギソウの「馴化」メカニズムを、数理モデルとカルシウムイメージング技術の双方から解明しています。", period: "25.11 - Present", details: "オジギソウが刺激を「記憶」し応答を制御する仕組みに迫るため、細胞の局所的疲労をモデル化する数理的なアプローチに加え、埼玉大学・豊田研究室でのカルシウムイメージング実験によって細胞内シグナル伝達を可視化し、理論と実験の両面から植物の知性（情報処理）の実体を解き明かそうとしています。", featured: false },
                { image: process.env.PUBLIC_URL + "/images/hydra.png", title: "ヒドラにおける古典的条件付けの解明", description: "単純な散在神経系を持つHydra vulgarisにおいて、学習の一種である古典的条件付けが存在するのかを検証しています", period: "25.04 - Present", details: "本研究は、脳を持たないヒドラ（Hydra vulgaris）が連合学習（古典的条件付け）を示すかを検証します。採食行動を引き起こす還元型グルタチオン（無条件刺激）と、体収縮を誘発する青色光（条件刺激）を繰り返し対提示し、その後、青色光のみで採食行動が誘発されるかをAIを用いた行動解析により評価します。これにより、学習能力の進化的起源に迫り、ヒドラの神経科学における新たなモデル生物としての可能性を探ります。", featured: true },
                { image: process.env.PUBLIC_URL + "/images/mimosa1.png", title: "オジギソウの応答調節（馴化）の生態学的意義の解明", description: "オジギソウの「馴化」がエネルギー収支に与える影響を、数理モデルを用いて定量的に解析しています。", period: "24.11 - Present", details: "オジギソウの「馴化」現象が持つ生存上の利点を解明するため、葉の開閉に伴うエネルギーコストと食害リスクのトレードオフを考慮した数理モデルを構築し、異なる生存戦略間での優位性を定量的に検証しています。", featured: false },
                { image: process.env.PUBLIC_URL + "/images/science.png", title: "サイエンス出前便", description: "地方と都市部の教育格差を是正し、子供たちが科学に触れ合う機会を増やすため科学教室を企画しています。", period: "24.11 - Present", details: "自身の経験から地方における科学教育の機会格差に問題意識を持ち、立ち上げたプロジェクトです。長野県内の小学生を対象に、身近な自然をテーマにした科学教室を企画・運営。観察や実験を通じて、子どもたちの知的好奇心を引き出し、科学の面白さを伝える活動を継続的に行っています。", featured: true },
                { image: process.env.PUBLIC_URL + "/images/mimosa_hab.jpg", title: "オジギソウの応答調節（馴化）の実証", description: "オジギソウの刺激に対する馴化能力（慣れ）を独自開発した葉開閉度定量化技術と全方位刺激装置により研究しています。", period: "24.03 - Present", details: "オジギソウが特定の刺激に対して応答を調節する能力を持つこと、そして刺激を学習する（馴化能力）能力を持つことを実証します。独自に開発した全方位刺激装置と、深層学習を用いた葉開閉度定量化技術を組み合わせることで、刺激の方向や強度とオジギソウの応答の関係性を定量的に評価します。将来的には、この能力がどのようなメカニズムで維持されているのかを明らかにします。", featured: true },
                { image: process.env.PUBLIC_URL + "/images/euglena.png", title: "ミドリムシにおける光驚動反応の解明", description: "走行性を持つミドリムシ（Euglena gracilis）が、光によって体収縮と方向転換をする光驚動反応を解析しました。", period: "21.04 - 24.03", details: "深層学習モデル（YOLO）とセグメンテーション技術を用いてミドリムシ（Euglena gracilis）の個体追跡を行い、その遊泳速度と回転数を定量化しました 。実験の結果、青色光の強度が急激に上昇するほど、遊泳速度が上がり、回転運動が激しくなる傾向（光驚動反応）を確認しました 。また、物理的な振動に対しても同様の逃避的な回転行動が見られることを発見し、これを「振動驚動反応」と定義しました 。なお、これらの反応強度に対して、飼育時の明暗周期（生物時計）による有意な影響は見られませんでした 。", featured: false },
                { image: process.env.PUBLIC_URL + "/images/mimosa.jpg", title: "オジギソウの就眠運動（概日リズム）", description: "オジギソウの概日リズムをその一つの出力系である就眠運動を観察することで研究しました。", period: "21.04 - 24.02", details: "植物が持つ体内時計（概日リズム）の出力の一つとして、夜間に葉を閉じる「就眠運動」に着目。深層学習を用いて24時間体制で葉の開閉度を自動定量化するシステムを構築しました。これにより、オジギソウが日没を予測して葉を閉じ始める行動や、光強度に応じて開度を微調整する様子を明らかにしました。", featured: false },
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
                { id: "thailand", name: "タイ", x: 71, y: 60, image: process.env.PUBLIC_URL + "/images/asc2025.png", details: "「Asia Science Camp 2025」に日本代表団の一員として参加。アジア各国から集まった学生やノーベル賞受賞者と交流し、科学的な議論を通じて国際的な視点と人的な繋がりを深めました。" }
            ]
        },
        activities: {
            title: "Activities & Involvements",
            site_button: "公式サイト",
            items: [
                { image: process.env.PUBLIC_URL + "/images/Matsuo2.png", year: "2025", title: "松尾研 GCI", event: "受講生", details: "東京大学松尾研究室主催のデータサイエンス講座にて、Pythonを用いたデータ解析や機械学習の実装を体系的に習得。コンペティション形式の課題を通じて実践力を磨き、現在の研究における実験データの定量化や解析基盤を確立しました。", link: "https://weblab.t.u-tokyo.ac.jp/news/gci-2025-summer-%e3%81%ae%e5%8b%9f%e9%9b%86%e9%96%8b%e5%a7%8b/" },
                { image: process.env.PUBLIC_URL + "/images/Matsuo1.png", year: "2025", title: "松尾研 LLM", event: "受講生", details: "大規模言語モデル（LLM）の仕組みや応用技術について、最先端の工学的知見を学習。生成AIのアーキテクチャへの理解を深め、科学研究プロセスへのAI導入や、生物学と情報学を繋ぐ新たなアプローチを模索する契機となりました。", link: "https://weblab.t.u-tokyo.ac.jp/large-language-model/" },
                { image: process.env.PUBLIC_URL + "/images/SPICE_entre.png", year: "2024-2025", title: "Stanford e-Entrepreneurship", event: "受講生", details: "スタンフォード大学の講師陣によるオンライン講義を通じて、起業家精神やビジネスプランニングの基礎を学びました。最終的には、教育格差問題に取り組むためのプロジェクトをチームで立案し、英語で発表しました。", link: "https://spice.fsi.stanford.edu/fellowship/stanford-e-entrepreneurship-japan" },
                { image: process.env.PUBLIC_URL + "/images/SPICE.png", year: "2025", title: "Stanford e-Japan", event: "受講生", details: "日米関係の専門家による講義を受け、外交、文化、経済など多角的な視点から日米関係について学びました。他の参加者との英語でのディスカッションを通じて、国際的な視野と議論のスキルを深めました。", link: "https://spice.fsi.stanford.edu/fellowship/stanford-e-japan" },
                { image: process.env.PUBLIC_URL + "/images/n1.png", year: "2024-2025", title: "エヌイチ道場", event: "5期生", details: "自身の「サイエンス出前便」プロジェクトを事業として発展させるため、メンターの指導のもと、事業計画の策定、ターゲット顧客の分析、収益モデルの検討など、実践的な起業プロセスを学びました。", link: "https://www.sunaba.org/n1dojo" },
                { image: process.env.PUBLIC_URL + "/images/UTokyo.jpg", year: "2024-", title: "UTokyoGSC-NEXT", event: "6期生", details: "東京大学の教授陣から最先端の科学技術に関する講義を受け、自身の研究テーマを深める機会を得ました。全国から集まった意欲の高い同世代の仲間と交流し、大きな刺激を受けています。", link: "https://gsc.iis.u-tokyo.ac.jp/" },
                { image: process.env.PUBLIC_URL + "/images/advancelab.png", year: "2024-", title: "ADvance Lab", event: "副所長", details: "現在は副所長として、ラボの運営にも関わっています。次世代と企業をつなぎ新たな価値を創造するとともに、地方におけるイベントなども企画し研究の輪を広げています。", link: "https://adlab.lne.st/" },
                { image: process.env.PUBLIC_URL + "/images/aoki.png", year: "2022-2023", title: "ながの視察団 AOKI咸臨丸", event: "7期生", details: "中学生の時に参加したこのプログラムが、現在の活動の原点の一つです。シリコンバレーでの研修では、失敗を恐れずに挑戦する文化に触れ、自身の行動指針に大きな影響を受けました。", link: "https://aoki-zaidan.or.jp/srv_kanrin.php" },
                { image: process.env.PUBLIC_URL + "/images/Tsukuba.png", year: "2021-2022", title: "つくば SKIP Academy", event: "受講生", details: "オンラインで大学レベルの数学や物理学に触れることで、科学研究に必要な論理的思考の基礎を固めました。この時の経験が、現在の研究で数理モデルを扱う上での助けとなっています。", link: "https://skip.tsukuba.ac.jp/" },

            ]
        },
        contact: {
            title: "Connect",
            description: "あらゆる境界を超えて、新たな「繋がり」を築きましょう。",
            email: "koma1667@outlook.jp"
        },
        footer: {
            columns: [
                { title: "Explore", items: ["Profile", "Vision", "News", "Research", "Projects", "Map"] },
                { title: "Activities", items: ["Activities", "ADvance Lab"] },
                { title: "Connect", items: ["Contact", "X (Twitter)", "Instagram", "Facebook", "LinkedIn"] }
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
        nav: { profile: "Profile", vision: "Vision", news: "News", research: "Research", projects: "Projects", map: "Map", activities: "Activities", contact: "Contact" },
        ui: {
            read_more: "READ MORE",
            click_for_details: "Click for details",
            featured_project: "FEATURED PROJECT",
            back: "BACK",
            award_label: "AWARD",
            copy: "COPY EMAIL",
            click_to_copy: "Click to Copy",
            copied: "COPIED",
            view: "VIEW",
            designed_with: "Designed with Botanical Intelligence.",
            back_to_main: "Back to Main Page",
            scroll: "SCROLL",
            view_website: "VIEW WEBSITE"
        },
        hero: {
            title: "Intelligence is Connection",
            subtitle: "The Rhizome of Intelligence",
            name_label: "Kazuhiro Komatsu | Student"
        },
        profile: {
            title: "Profile",
            name: "Kazuhiro Komatsu",
            affiliation: "Suwa Seiryo High School | Vice Director, ADvance Lab",
            description: "I believe that new 'intelligence' is born precisely when different fields connect.\n\nBased in Nagano, I conduct research on Mimosa pudica from the interdisciplinary perspective of 'Biology × Informatics,' while also leading science education initiatives to bridge the educational gap between rural and urban areas.\nConnecting laboratory insights with social issues, and cutting-edge technology with children in rural regions. By acting as a 'bridge' that smoothly connects these often divided worlds, I aim to unlock new possibilities.",
            cv_button: "View CV"
        },
        vision: {
            title: "Vision",
            heading: "Redefining Intelligence",
            description: "Previously, intelligence was considered a privilege of animals with brains and nervous systems.\n\nHowever, I believe that intelligence does not reside in specific organs but emerges from the 'network (connection)' itself where countless elements interact. Plants, without a central processing unit like a brain, perform advanced information processing using a distributed network spread throughout their bodies. This fact suggests that intelligence does not necessarily require a nervous system.\nThrough plant research, I aim to extend the definition of intelligence from 'structure' to 'system' and reveal the universality of intelligence possessed by life.",
        },
        news: {
            title: "News",
            items: [
                {
                    id: "new-website",
                    date: "July 15, 2025",
                    title: "Major Portfolio Site Renewal",
                    summary: "Refreshed the website with the concept of 'The Rhizome of Intelligence'.",
                    fullContent: "Today, I've launched a major renewal of my portfolio site. Based on the concept 'The Rhizome of Intelligence,' it visually expresses the combination of plant networks and AI. Please see how my past, present, and future activities connect organically.<br><br><a href='https://sites.google.com/view/kazuhirokomatsu' target='_blank' rel='noopener noreferrer' class='text-emerald-500 hover:underline'>Previous Site</a>",
                    images: getNewsImages("new_website")
                },
                {
                    id: "nagano-gakkasyo2025",
                    date: "Oct 4, 2025",
                    title: "Governor's Prize at Nagano Prefecture Student Science Award",
                    summary: "Received the top award for research elucidating the 'habituation-like' phenomenon in Mimosa pudica using image analysis technology.",
                    fullContent: "In October 2025, my research project received the 'Governor's Prize,' the highest award, at the Nagano Prefecture Student Science Award judging session.<br><br>The research theme is 'Do Plants Learn from Stimuli? - Quantitative Analysis of Habituation to Specific Stimuli in Mimosa pudica.' The phenomenon of 'habituation,' where plants stop responding to repeated stimuli, is attracting attention as a primitive 'memory/learning' ability in plants.<br><br>The key to this research was reconsidering plant behavior, which had previously relied on visual inspection or simple measurement, as high-precision 'image' data. By utilizing a self-made photographing device and analysis program to quantify and visualize leaf opening and closing movements, I succeeded in quantitatively demonstrating the response regulation ability of Mimosa pudica, which had been ambiguous until now.<br><br>The fact that this approach of 'connecting' biological observation and information engineering analysis methods was evaluated gave me great confidence.<br><br>Moving forward, towards the Japan Student Science Award (Central Judging) as a representative of Nagano Prefecture, I will proceed with further data verification and scrutiny of logic. I would like to express my sincere gratitude to the teachers who guide me enthusiastically on a daily basis, friends with whom I exchanged discussions, and everyone who supports my research activities.",
                    images: getNewsImages("NaganoGakkasyo2025")
                },
                {
                    id: "UTokyoGSC-seika",
                    date: "Nov 15, 2025",
                    title: "Research Presentation at UTokyoGSC-NEXT Stage 3 Achievement Presentation",
                    summary: "Presented research results on Mimosa pudica conducted under the guidance of the Suetsugu Laboratory at the University of Tokyo.",
                    fullContent: "On November 15, 2025, I participated in the Stage 3 Achievement Presentation of the University of Tokyo Global Science Campus (UTokyoGSC-Next). I have been conducting research activities under the guidance of Professor Noriyuki Suetsugu's laboratory at the University of Tokyo, and this was a culmination presentation marking a milestone.<br><br>Regarding my research theme 'Habituation of Mimosa pudica,' I gave a presentation mixing insights gained in the advanced environment of the Suetsugu Laboratory and results of 'image' analysis using a self-made system.<br><br>On the day, in addition to presentations by peers who ran through Stage 3 together, I was also able to hear unique and interesting research plans from Stage 2 students who are about to enter full-scale research, and I was surprised by the richness of their ideas. Being able to participate in a place of exchange that 'connects' passion for science across grades and stages is a great asset for me.<br><br>I would like to express my deep gratitude to Professor Suetsugu, everyone in the laboratory, and the secretariat. Using the experience gained here as sustenance, I will continue to push forward with my research activities.",
                    images: getNewsImages("UTokyoGSC")
                },
                {
                    id: "koushien",
                    date: "Nov 29, 2025",
                    title: "Runner-up at Science Koushien Nagano Prefecture Qualifier (1st in Practical Skills)",
                    summary: "Contributed to the team as a biology specialist. Although we won 1st place overall in the practical competition, we unfortunately finished 2nd overall and missed the national tournament.",
                    fullContent: "On November 29, 2025, I participated in the 'Science Koushien' Nagano Prefecture Qualifier as a member of the school representative team (in charge of biology).<br><br>The result was 2nd place overall in the prefecture. We fell just one step short of the ticket to the national tournament given only to the winning team.<br><br>Regret remains that we could not extend our score in the written competition, but in the 'practical competition' where teamwork is tested, we were able to achieve the best result of 1st place overall. The process of members with different fields of expertise pooling their wisdom to tackle problem-solving was a very dense time.<br><br>Also, exploring and 'connecting' beyond the framework of the school with science-loving students from other high schools in the prefecture through the competition was a major harvest. Using the network gained here and the frustration of falling just short as a springboard, I would like to aim even higher in my individual research activities.",
                    images: getNewsImages("Koushien")
                },
                {
                    id: "mbsj-2025",
                    date: "Dec 5, 2025",
                    title: "Poster Presentation at the 48th Annual Meeting of the Molecular Biology Society of Japan",
                    summary: "Presented two research results on Mimosa pudica and Hydra at one of the largest domestic conferences held at Pacifico Yokohama.",
                    fullContent: "On December 5, 2025, I participated in the High School Student Presentation Category of the '48th Annual Meeting of the Molecular Biology Society of Japan' held at Pacifico Yokohama.<br><br>This time, I gave presentations on two themes. The first was about my main theme 'Stimulus Habituation of Mimosa pudica,' focusing on analysis results using mathematical models. The second is research on 'Hydra' that I am working on jointly with friends as a school assignment study.<br><br>The venue was extremely large and I was overwhelmed by its scale, but there were sessions close to my research field, and it was very studying to be able to touch upon cutting-edge knowledge. Being able to discuss with many experts is a great asset.",
                    images: getNewsImages("MBSJ2025")
                },
                {
                    id: "sc-world-2025",
                    date: "Dec 13, 2025",
                    title: "Presentation at Science Castle World 2025",
                    summary: "Participated in the research presentation held at the Institute of Science Tokyo. It was a valuable opportunity for exchange with peers from Japan and abroad.",
                    fullContent: "On December 13, 2025, I participated in a poster presentation at 'Science Castle World 2025' held at the Institute of Science Tokyo (formerly Tokyo Institute of Technology).<br><br>Although I did not receive an award this time, I gained an invaluable experience. In particular, meeting directly with seniors I had long wanted to talk to and discussing in English with participants from overseas was a great stimulation for me.<br><br>Also, I was able to reunite with friends I had made friends with through past science activities and talk about each other's research and recent events. It was a wonderful opportunity to strongly realize the 'connection with people' through research, more than the results.",
                    images: getNewsImages("SCWorld2025")
                },
                {
                    id: "acmb-jsmb-2025",
                    date: "July 11, 2025",
                    title: "Poster Presentation at ACMB-JSMB2025",
                    summary: "Presented a mathematical model on the stimulus habituation mechanism of plants.",
                    fullContent: "Presented a poster on the stimulus habituation mechanism of Mimosa pudica at ACMB-JSMB2025. Analyzed the phenomenon, which can be called plant 'memory,' using mathematical models. This joint conference is a major academic event where cutting-edge research in mathematical biology from Asia and Japan gathers within one place.\nIn my presentation, I shared new insights obtained through mathematical approaches and model construction regarding the mechanism of how plants adapt to environmental stimuli and change their responses. In particular, I was able to have lively discussions with participating researchers about the results of analyzing the phenomenon of stimulus habituation in Mimosa pudica, which can be called 'memory,' using mathematical models, making it a very meaningful time.",
                    images: getNewsImages("ACMBJSMB")
                },
                {
                    id: "asc-2025",
                    date: "Aug 7, 2025",
                    title: "Participated in Asian Science Camp 2025",
                    summary: "Exchange with young researchers from Asian countries.",
                    fullContent: "From July 31st to August 6th, 2025, I participated in the Asian Science Camp 2025 (ASC2025) held in Thailand as a member of the Japanese delegation. This camp is an international program aimed at fostering the next generation of scientists through lectures by Nobel laureates and world-class researchers, and exchanges with high school and university students selected from Asian countries.\nDuring the period, in addition to listening to lectures in a wide range of scientific fields, I participated in discussions with lecturers and participants, and group poster sessions. Through discussions with participants from various countries, I was able to touch upon diverse scientific perspectives and approaches, making it a very meaningful time. I would like to utilize the international experience and knowledge gained at this camp for my future research activities.",
                    images: getNewsImages("ASC2025")
                },
                {
                    id: "expo-workshop-announce",
                    date: "Aug 11, 2025",
                    title: "[Announcement] Workshop at Osaka Expo",
                    summary: "Workshop to learn plant abilities through touch.",
                    fullContent: "On August 24, 2025, I will hold a workshop at the Osaka-Kansai Expo. We will provide experiences to touch plant intelligence, such as visualizing the electrical signals of Mimosa pudica.",
                    images: getNewsImages("Expo2025")
                },
                {
                    id: "expo-workshop-report",
                    date: "Aug 24, 2025",
                    title: "Hosted a Workshop at Expo 2025 Osaka, Kansai",
                    summary: "Organized and hosted a science workshop on Mimosa pudica at the 'Playground of Life: Jellyfish Pavilion' in Expo 2025 Osaka, Kansai.",
                    fullContent: "On August 24, 2025, I successfully hosted a workshop titled 'The Landscape of Symbiosis Woven by Plants and People - Learning Plant Abilities through Touch' at the 'Playground of Life: Jellyfish Pavilion' in Expo 2025 Osaka, Kansai.<br><br>This workshop aimed to let people of all ages experience the fun of science through the mysterious abilities of Mimosa pudica, my research subject. I am truly grateful for the opportunity to present at such a special venue where people gather from all over the world.<br><br>On the day, we set up five stations where participants could intuitively experience plant capabilities. At the 'Mimosa Interaction Station,' detailed observations of leaves closing upon touch elicited surprises and cheers from children. Their shining eyes and questions like 'Why does it move?' and 'How does it work?' made it a very moving day, as I felt I was able to deliver seeds of science to the future.<br><br>This experience reaffirmed the importance and joy of giving back research findings to society. I intend to utilize this valuable learning not only for my future research activities but also for science education projects such as the 'Science Delivery Service' in Nagano.<br><br>Finally, I would like to express my sincere gratitude to everyone who visited, the Expo officials who supported the event, and the Jellyfish Pavilion staff.",
                    images: getNewsImages("expo_workshop")
                },
                {
                    id: "jbs-2025",
                    date: "Sep 20, 2025",
                    title: "Presentation & Award at the 89th Annual Meeting of the Botanical Society of Japan",
                    summary: "Presented a poster and received an award at the Botanical Society of Japan. It was a valuable experience to discuss with many researchers.",
                    fullContent: "On Saturday, September 20, 2025, I participated in the High School Student Poster Presentation category at the '89th Annual Meeting of the Botanical Society of Japan' held at the Fukuoka International Congress Center.<br><br>This society is one of the largest academic gatherings for plant science research in Japan. I presented my research results based on the latest data obtained from a newly established experimental system.<br><br>On the day, I was blessed with the opportunity to directly discuss with many researchers active on the front lines in Japan and abroad through the poster session. We discussed for over 4 hours, receiving distinct feedback on my research and valuable advice leading to future developments, making it a very meaningful time.<br><br>As a result, I was fortunate enough to receive an award for my poster presentation. Encouraged by this award, I will continue to pursue further inquiries.<br><br>I would like to take this opportunity to express my sincere gratitude to the teachers who guided me and everyone who enthusiastically discussed at the booth.",
                    images: getNewsImages("JBS2025")
                },
                {
                    id: "rohto-future-2025",
                    date: "Sep 28, 2025",
                    title: "Future Proposal Presentation at Rohto/Leave a Nest Co-Creation Project",
                    summary: "Presented a solution for mental illness in the year 2100 at Grand Green Osaka.",
                    fullContent: "On Sunday, September 28, 2025, I gave a presentation at the project results report meeting co-hosted by Rohto Pharmaceutical Co., Ltd. and Leave a Nest Co., Ltd., held at 'Grand Green Osaka' in front of Osaka Station.<br><br>This project aimed for high school students to explore future social issues and create 'future research themes' taking the opportunity of the Osaka Expo. As a team member, I tackled the magnificent theme of 'Mental Illness in 2100' for over two months.<br><br>Leading up to the presentation, in addition to repeated online discussions with the team, we actually visited the Osaka Expo to deepen our knowledge of future medical care and society. On the day, not only were we able to present the ideas we had refined, but we also had active discussions on proposals from other teams, making it a very fulfilling time.<br><br>Through this project, I became strongly conscious of the perspective of applied science: how to connect the knowledge of basic research such as Mimosa pudica and mathematical models that I have been working on to social implementation. This is a valuable experience that will be a major turning point in considering my career as a researcher.<br><br>I would like to express my sincere gratitude to everyone at Rohto Pharmaceutical Co., Ltd., Leave a Nest Co., Ltd., the team members who deepened their inquiries together, and everyone involved for giving me such a wonderful opportunity.",
                    images: getNewsImages("RohtoFuture2025")
                },
                {
                    id: "Gakkasyo-2025",
                    date: "Dec 19, 2025",
                    title: "[Breaking] Received Minister's Award at JSSA & Selected for ISEF",
                    summary: "Received the Minister of State for Science and Technology Policy Award at the Japan Student Science Awards and qualified for ISEF. Honored to receive encouraging words from H.I.H. Crown Prince Akishino and Minister Onoda.",
                    fullContent: "At the 69th Japan Student Science Awards central ceremony, I received the Minister of State for Science and Technology Policy Award (5th place nationwide). This also confirmed my selection to represent Japan at ISEF (International Science and Engineering Fair), the world's largest student science contest held in the US next May.<br><br>I feel blessed to be chosen among many excellent researches. I am aware that the current evaluation includes a 'high school student bonus.' I renew my determination to go beyond such frameworks and devote myself further to be evaluated purely as a researcher.<br><br>After the ceremony, I had the honor of conversing with H.I.H. Crown Prince Akishino. His questions about my research and encouraging words were very inspiring. I also shook hands with Minister Onoda (Science and Technology Policy) and spoke directly about my research.<br><br>Connections with brilliant peer researchers met at the venue are a great asset. Cherishing these bonds, I will do my best on the world stage.",
                    images: getNewsImages("Gakkasyo-2025")
                },
                {
                    id: "ABA-Symposium-2026",
                    date: "Jan 14, 2026",
                    title: "[Hong Kong] Oral & Poster Presentation at the 12th Asian Biophysics Association Symposium",
                    summary: "Participated in the ABA Symposium in Hong Kong, delivering an English poster presentation and my first-ever oral presentation. Grateful for the opportunity to challenge myself as a high school student, I experienced the fascination of biophysics and personal growth through solo overseas travel.",
                    fullContent: "On January 12th and 13th, I participated in 'The 12th Asian Biophysics Association (ABA) Symposium' held at the Hong Kong University of Science and Technology. This time, in addition to an English poster presentation, I challenged myself with my first-ever Oral Presentation.<br><br>The period from acceptance to the actual event was extremely short, and it was a tough situation where the manuscript wasn't finished until the night before. However, the enthusiasm to 'convey my research' prevailed during the actual performance, and I was able to present surprisingly smoothly (at the same time, I keenly felt the lack of basic English proficiency).<br><br>At the conference, I was able to connect with professors who are indispensable for future research, such as experts in membrane proteins. In addition to the macroscopic approach so far, I will deepen my research by incorporating a microscopic perspective of stimulus receptor sensors (membrane proteins). Touching upon the fun of the field of biophysics was also a major harvest.<br><br>Also, this was a completely solo trip. Due to lack of preparation, I encountered serious troubles with hotel and flight arrangements, but I keenly felt the appreciation for the support of those around me. Touching the exotic culture of Hong Kong, I feel that I have grown not only as a researcher but also as a person.<br><br>I would like to express my sincere gratitude to the secretariat for accepting me, a high school student outside the field, for an oral presentation, the Japan Science Society for their support, and my family (especially my mother) who helped me during the troubles.",
                    images: getNewsImages("ABA-Symposium-2026"),
                    link: "https://xiiaba.hkust.edu.hk/"
                }
            ],
            view_more_button: "VIEW ALL NEWS",
            details_button: "Details"
        },
        research: {
            title: "Research",
            heading_grants: "Funds & Grants",
            heading_awards: "Conferences & Presentations",
            description: "Conducting diverse research including verification and mathematical analysis of response regulation in Mimosa pudica, and classical conditioning in Hydra.",
            grants: [
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
                    year: "2025",
                    title: "The 69th Japan Student Science Awards (High School Division)",
                    prize: "-",
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
            view_all_button: "VIEW ALL",
            items: [
                { image: process.env.PUBLIC_URL + "/images/mimosa2.png", title: "Mechanism of Habituation", description: "Elucidating the mechanism of 'habituation' through both mathematical models and calcium imaging.", period: "25.11 - Present", details: "To approach the mechanism by which Mimosa pudica 'remembers' stimuli and controls responses, we are visualizing intracellular signal transduction via calcium imaging experiments at Saitama University (Toyota Lab), in addition to mathematical approaches modeling local cellular fatigue. We aim to reveal the entity of plant intelligence (information processing) from both theoretical and experimental sides.", featured: false },
                { image: process.env.PUBLIC_URL + "/images/hydra.png", title: "Classical Conditioning in Hydra", description: "Verifying the existence of classical conditioning in Hydra vulgaris, which has a simple diffuse nervous system.", period: "25.04 - Present", details: "Verifying whether Hydra vulgaris, which lacks a brain, exhibits associative learning (classical conditioning). Repeatedly presenting reduced glutathione (unconditioned stimulus) and blue light (conditioned stimulus), and evaluating whether feeding behavior is induced by blue light alone using AI behavioral analysis. Approaching the evolutionary origin of learning ability.", featured: true },
                { image: process.env.PUBLIC_URL + "/images/mimosa1.png", title: "Ecological Significance of Habituation", description: "Quantitatively analyzing the impact of 'habituation' on energy balance using mathematical models.", period: "24.11 - Present", details: "To elucidate the survival advantages of 'habituation,' we constructed a mathematical model considering the trade-off between energy costs of leaf movement and predation risk, quantitatively verifying its superiority among different survival strategies.", featured: false },
                { image: process.env.PUBLIC_URL + "/images/science.png", title: "Science Delivery Service", description: "Planning science classrooms to bridge the educational gap between rural and urban areas.", period: "24.11 - Present", details: "A project launched from personal awareness of the opportunity gap in science education in rural areas. Planning and operating science classrooms for elementary students in Nagano Prefecture with familiar nature themes. Continuously conducting activities to bring out children's intellectual curiosity and convey the fun of science.", featured: true },
                { image: process.env.PUBLIC_URL + "/images/mimosa_hab.jpg", title: "Habituation in Mimosa pudica", description: "Demonstrating habituation capability in Mimosa pudica using original leaf quantifying technology.", period: "24.03 - Present", details: "Demonstrating that Mimosa pudica possesses the ability to regulate responses to specific stimuli and to learn (habituate). By combining a uniquely devised omnidirectional stimulation device with deep-learning-based leaf movement quantification, we quantitatively evaluate the relationship between stimulus direction/intensity and response. We aim to clarify the mechanism maintaining this ability.", featured: true },
                { image: process.env.PUBLIC_URL + "/images/euglena.png", title: "Photophobic Response in Euglena", description: "Analyzed the photophobic response where Euglena gracilis contracts and changes direction due to light.", period: "21.04 - 24.03", details: "Quantified swimming speed and rotation of Euglena gracilis using deep learning (YOLO) and segmentation for tracking. Confirmed a tendency (photophobic response) where swimming speed increases and rotation becomes more intense as blue light intensity increases rapidly. Also discovered similar evasive rotation behavior against physical vibration, defining it as 'Vibration Phobic Response'.", featured: false },
                { image: process.env.PUBLIC_URL + "/images/mimosa.jpg", title: "Nyctinasty & Circadian Rhythm", description: "Studied the circadian rhythm of Mimosa pudica by observing its nyctinastic movement.", period: "21.04 - 24.02", details: "Focused on 'nyctinastic movement' (closing leaves at night) as one output of the plant's biological clock. Built a system to automatically quantify leaf opening/closing 24/7 using deep learning. Revealed behaviors such as predicting sunset to close leaves and fine-tuning opening degree according to light intensity.", featured: false },
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
                { id: "thailand", name: "Thailand", x: 71, y: 60, image: process.env.PUBLIC_URL + "/images/asc2025.png", details: "Participated in 'Asia Science Camp 2025' as a Japanese delegate. Deepened international perspectives through scientific discussions with students and Nobel laureates from Asia." }
            ]
        },
        activities: {
            title: "Activities & Involvements",
            site_button: "Official Site",
            items: [
                { image: process.env.PUBLIC_URL + "/images/Matsuo2.png", year: "2025", title: "Matsuo Lab GCI", event: "Student", details: "Systematically learned data analysis and machine learning implementation using Python at the Data Science Course hosted by the University of Tokyo Matsuo Lab. Honed practical skills through competition-style assignments and established a foundation for quantification and analysis of experimental data in current research.", link: "https://weblab.t.u-tokyo.ac.jp/news/gci-2025-summer-%e3%81%ae%e5%8b%9f%e9%9b%86%e9%96%8b%e5%a7%8b/" },
                { image: process.env.PUBLIC_URL + "/images/Matsuo1.png", year: "2025", title: "Matsuo Lab LLM", event: "Student", details: "Learned cutting-edge engineering insights into Large Language Models (LLM). Deepened understanding of Generative AI architecture, serving as a catalyst for introducing AI into the scientific research process and exploring new approaches connecting biology and informatics.", link: "https://weblab.t.u-tokyo.ac.jp/large-language-model/" },
                { image: process.env.PUBLIC_URL + "/images/SPICE_entre.png", year: "2024-2025", title: "Stanford e-Entrepreneurship", event: "Student", details: "Learned the basics of entrepreneurship and business planning through online lectures by Stanford University instructors. Finally, planned a project to address the educational gap problem as a team and presented it in English.", link: "https://spice.fsi.stanford.edu/fellowship/stanford-e-entrepreneurship-japan" },
                { image: process.env.PUBLIC_URL + "/images/SPICE.png", year: "2025", title: "Stanford e-Japan", event: "Student", details: "Took lectures by experts on Japan-US relations and learned about Japan-US relations from multiple perspectives such as diplomacy, culture, and economy. Deepened international perspectives and discussion skills through discussions in English with other participants.", link: "https://spice.fsi.stanford.edu/fellowship/stanford-e-japan" },
                { image: process.env.PUBLIC_URL + "/images/n1.png", year: "2024-2025", title: "N1 Dojo", event: "5th Cohort", details: "In order to develop my 'Science Delivery Service' project as a business, under the guidance of a mentor, I learned the practical startup process such as formulating a business plan, analyzing target customers, and examining a revenue model.", link: "https://www.sunaba.org/n1dojo" },
                { image: process.env.PUBLIC_URL + "/images/UTokyo.jpg", year: "2024-", title: "UTokyoGSC-NEXT", event: "6th Cohort", details: "Received lectures on cutting-edge science and technology from professors at the University of Tokyo and had the opportunity to deepen my own research theme. I am greatly stimulated by interacting with highly motivated peers of the same generation gathered from all over the country.", link: "https://gsc.iis.u-tokyo.ac.jp/" },
                { image: process.env.PUBLIC_URL + "/images/advancelab.png", year: "2024-", title: "ADvance Lab", event: "Vice Director", details: "Currently Involved in the operation of the lab as Vice Director. While creating new value by connecting the next generation and companies, I also plan events in rural areas to expand the circle of research.", link: "https://adlab.lne.st/" },
                { image: process.env.PUBLIC_URL + "/images/aoki.png", year: "2022-2023", title: "Nagano Study Tour AOKI Kanrin Maru", event: "7th Cohort", details: "This program I participated in when I was a junior high school student is one of the origins of my current activities. During the training in Silicon Valley, I came into contact with a culture of challenging without fear of failure, which had a great influence on my own action guidelines.", link: "https://aoki-zaidan.or.jp/srv_kanrin.php" },
                { image: process.env.PUBLIC_URL + "/images/Tsukuba.png", year: "2021-2022", title: "Tsukuba SKIP Academy", event: "Student", details: "Solidified the foundation of logical thinking necessary for scientific research by touching on university-level mathematics and physics online. The experience at this time helps me in handling mathematical models in my current research.", link: "https://skip.tsukuba.ac.jp/" }
            ]
        },
        contact: {
            title: "Connect",
            description: "Research, Co-creation, Dialogue.\nI look forward to connecting new synapses beyond all boundaries.",
            email: "koma1667@outlook.jp"
        },
        footer: {
            columns: [
                { title: "Explore", items: ["Profile", "Vision", "News", "Research", "Projects", "Map"] },
                { title: "Activities", items: ["Activities", "ADvance Lab"] },
                { title: "Connect", items: ["Contact", "X (Twitter)", "Instagram", "Facebook", "LinkedIn"] }
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

// --- Botanical Synapse Component (Fixed Background) ---
const BotanicalSynapse = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationFrameId;

        // --- 設定 ---
        let width = window.innerWidth;
        let height = window.innerHeight;
        const isMobile = width < 600;

        canvas.width = width;
        canvas.height = height;

        const CONFIG = {
            nodeCount: isMobile ? 30 : (width < 1024 ? 50 : 80), // PCは80のまま、モバイルとタブレットで減らす
            connectDist: isMobile ? 100 : (width < 1024 ? 150 : 250), // 接続距離も調整
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
                ctx.strokeStyle = this.weight > 0.4 ? `rgba(100, 116, 139,${this.weight * 0.4})` : `rgba(71, 85, 105,${this.weight * 0.2})`; // よりシックなグレー系の線
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
                ctx.fillStyle = `rgba(160, 240, 160,${0.8 - this.gen * 0.15})`;
                ctx.fill();
            }
        }

        class Pulse {
            constructor(x, y) { this.x = x; this.y = y; this.r = 0; this.life = 1; }
            update() { this.r += 2; this.life -= 0.015; }
            draw() {
                if (this.life <= 0) return;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(100,200,120,${this.life * 0.2})`; ctx.stroke();
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

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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
            animationFrameId = requestAnimationFrame(animate);
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
        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        const handleMouseMove = e => { state.mouse.x = e.clientX; state.mouse.y = e.clientY; };
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

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-auto" />;
};


// --- 新しいイントロアニメーション (Random Node Loading) ---
const NodeIntro = ({ onFinish }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        const CONFIG = {
            nodeCount: 6,
            speed: 0.04,
            color: "255, 255, 255" // White
        };

        const nodes = [];
        const cx = w / 2;
        const cy = h / 2;
        const baseRadius = Math.min(w, h) * 0.15;

        for (let i = 0; i < CONFIG.nodeCount; i++) {
            const angle = (i / CONFIG.nodeCount) * Math.PI * 2 + (Math.random() - 0.5);
            const r = baseRadius * (0.8 + Math.random() * 0.6);
            nodes.push({
                x: cx + Math.cos(angle) * r,
                y: cy + Math.sin(angle) * r,
                active: false
            });
        }

        let indices = Array.from({ length: CONFIG.nodeCount }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        const path = [...indices, indices[0]];

        nodes[path[0]].active = true;

        let pathIndex = 0;
        let lineProgress = 0;
        let frameId;
        let finished = false;

        const render = () => {
            ctx.clearRect(0, 0, w, h);
            const time = Date.now() * 0.001;

            if (!finished) {
                lineProgress += CONFIG.speed;
                if (lineProgress >= 1.0) {
                    lineProgress = 0;
                    pathIndex++;
                    if (pathIndex < path.length) nodes[path[pathIndex]].active = true;
                    if (pathIndex >= path.length - 1) {
                        finished = true;
                        if (onFinish) setTimeout(onFinish, 800);
                    }
                }
            }

            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            nodes.forEach((n, i) => {
                const floatX = Math.sin(time + i * 1.5) * 3;
                const floatY = Math.cos(time * 0.8 + i) * 3;
                const dx = n.x + floatX;
                const dy = n.y + floatY;

                if (n.active) {
                    ctx.beginPath();
                    ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${CONFIG.color}, 1)`;
                    ctx.fill();

                    const breath = Math.sin(time * 3 + i) * 0.5 + 0.5;
                    ctx.beginPath();
                    ctx.arc(dx, dy, 5 + breath * 4, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${CONFIG.color}, ${0.3 * (1 - breath)})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${CONFIG.color}, 0.2)`;
                    ctx.fill();
                }

                n.currentX = dx;
                n.currentY = dy;
            });

            ctx.beginPath();
            let first = true;
            for (let i = 0; i <= Math.min(pathIndex, path.length - 1); i++) {
                const n = nodes[path[i]];
                if (first) { ctx.moveTo(n.currentX, n.currentY); first = false; }
                else { ctx.lineTo(n.currentX, n.currentY); }
            }
            ctx.strokeStyle = `rgba(${CONFIG.color}, 0.4)`;
            ctx.lineWidth = 2;
            ctx.stroke();

            if (!finished && pathIndex < path.length - 1) {
                const n1 = nodes[path[pathIndex]];
                const n2 = nodes[path[pathIndex + 1]];
                const cx = n1.currentX + (n2.currentX - n1.currentX) * lineProgress;
                const cy = n1.currentY + (n2.currentY - n1.currentY) * lineProgress;

                ctx.beginPath(); ctx.moveTo(n1.currentX, n1.currentY); ctx.lineTo(cx, cy);
                const grad = ctx.createLinearGradient(n1.currentX, n1.currentY, n2.currentX, n2.currentY);
                grad.addColorStop(0, `rgba(${CONFIG.color}, 0.3)`);
                grad.addColorStop(1, `rgba(${CONFIG.color}, 1)`);
                ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.stroke();

                ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${CONFIG.color}, 1)`; ctx.fill();
            }

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
        window.addEventListener('resize', handleResize);
        render();

        return () => { cancelAnimationFrame(frameId); window.removeEventListener('resize', handleResize); };
    }, [onFinish]);

    const [loadingWord, setLoadingWord] = useState('People');
    const words = ['People', 'Region', 'Knowledge', 'Science', 'Future', 'Nature', 'Intelligence', 'Empathy', 'Technology', 'Life', 'Synapse', 'Universe', 'Society', 'Ideas', 'World'];

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingWord(prev => {
                const currentIndex = words.indexOf(prev);
                return words[(currentIndex + 1) % words.length];
            });
        }, 80);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0" />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.5 }}
                className="absolute bottom-24 left-0 w-full text-center z-10 text-white font-mono text-xs md:text-sm tracking-[0.2em] uppercase mix-blend-difference"
            >
                Connecting <span className="text-emerald-500">{loadingWord}</span>...
            </motion.div>
        </div>
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
const ChevronDownIcon = ({ isExpanded }) => (
    <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 text-gray-400"
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


// --- カスタムカーソルコンポーネント (Green Glow) ---
const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const mouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setIsHovering(!!e.target.closest('[data-hoverable="true"]'));
        };

        window.addEventListener("mousemove", mouseMove);
        return () => {
            window.removeEventListener("mousemove", mouseMove);
        };
    }, []);

    const outerVariants = {
        default: {
            height: 20,
            width: 20,
            x: mousePosition.x - 10,
            y: mousePosition.y - 10,
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // White base
            border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        hover: {
            height: 40,
            width: 40,
            x: mousePosition.x - 20,
            y: mousePosition.y - 20,
            backgroundColor: 'rgba(30, 100, 70, 0.3)', // Muted Green
            border: '1px solid rgba(50, 150, 100, 0.5)',
        },
    };

    return (
        <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block backdrop-blur-[1px]"
            variants={outerVariants}
            animate={isHovering ? "hover" : "default"}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
    );
};

// --- グラデーションテキストコンポーネント (Green Neon) ---
const GradientText = ({ children, className }) => {
    return (
        <span className={`bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 text-transparent bg-clip-text ${className}`}>
            {children}
        </span>
    );
};


// --- Header (Minimal) ---
const Header = ({ lang, setLang, content, setPage }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setPage('home');
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-4' : 'bg-transparent py-8'}`}>
            <nav className="max-w-[90%] mx-auto flex items-center justify-between">
                <span data-hoverable="true" className="text-gray-300 font-normal text-xs tracking-[0.2em] cursor-pointer font-['Syne',sans-serif]" onClick={() => scrollToSection('hero')}>Kazuhiro.K</span>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center space-x-6">
                        {Object.entries(content.nav).map(([key, value]) => (
                            <a data-hoverable="true" key={key} onClick={() => scrollToSection(key)} className="text-gray-500 hover:text-white text-xs font-medium cursor-pointer transition-colors uppercase tracking-[0.1em]"><AnimatedText text={value} /></a>
                        ))}
                    </div>
                    <button data-hoverable="true" onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')} className="text-xs text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-2">
                        <GlobeIcon />
                        <AnimatedText text={lang === 'ja' ? 'EN' : 'JP'} />
                    </button>
                </div>
            </nav>
        </header>
    );
};

// --- ヒーローセクション (Minimal & Bottom-Right) ---
const HeroSection = ({ content }) => {
    return (
        <section id="hero" className="h-screen w-full relative overflow-hidden">
            {/* Background Canvas */}
            <BotanicalSynapse />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>

            {/* コンテンツを右下に配置 (Minimal) */}
            <div className="absolute bottom-12 right-12 md:bottom-20 md:right-20 z-10 pointer-events-none select-none text-right">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="text-xl md:text-2xl font-normal tracking-[0.2em] mb-4 text-gray-100 font-['Syne',sans-serif] bg-black/40 backdrop-blur-[2px] rounded-sm px-4 py-2 inline-block"
                >
                    {content.hero.title}
                </motion.h1>
                <div className="flex flex-col items-end gap-2">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2, delay: 1.2 }}
                        className="text-xs md:text-xs text-emerald-500/80 font-mono tracking-[0.4em] uppercase"
                    >
                        <AnimatedText text={content.hero.subtitle} />
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.0, delay: 1.8 }}
                        className="text-xs text-gray-600 font-mono tracking-widest mt-2"
                    >
                        <AnimatedText text={content.hero.name_label} />
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator (Minimal) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 5, 0] }}
                transition={{ duration: 3, delay: 3, repeat: Infinity }}
                className="absolute bottom-8 left-8 text-gray-700 pointer-events-none"
            >
                <span className="text-xs tracking-widest font-mono">SCROLL</span>
            </motion.div>
        </section>
    );
};

// --- Research Section (Split Grants & Awards) ---
const ResearchListGroup = ({ title, items, category, onDetailSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Sort items by year descending
    const sortedItems = [...items].sort((a, b) => parseInt(b.year) - parseInt(a.year));

    // Initial view shows latest 3
    const visibleItems = sortedItems.slice(0, 3);
    const hiddenItems = sortedItems.slice(3);

    const showButton = hiddenItems.length > 0;

    return (
        <div className="mb-16 last:mb-0">
            <h3 className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mb-8 ml-2 border-l-2 border-emerald-900/50 pl-4">{title}</h3>
            <div className="flex flex-col gap-1">
                {/* Always visible items */}
                {visibleItems.map((item, index) => (
                    <div
                        key={`${title}-visible-${index}-${item.title}`}
                        data-hoverable="true"
                        onClick={() => onDetailSelect({ ...item, category })}
                        className="group flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0 bg-black/50 backdrop-blur-sm hover:bg-black/60 p-6 rounded-sm transition-colors"
                    >
                        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 flex-1">
                            <span className="font-mono text-emerald-600/70 text-xs tracking-widest min-w-[3rem] group-hover:text-emerald-500 transition-colors"><AnimatedText text={item.year} /></span>
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors mb-1 md:mb-0 tracking-wide"><AnimatedText text={item.title} /></h4>
                            </div>
                        </div>
                        <div className="mt-2 md:mt-0 md:pl-8 flex items-center justify-between md:justify-end gap-4 min-w-[30%]">
                            {item.prize && <span className="text-xs text-gray-500 group-hover:text-emerald-400 transition-colors text-right flex-1 tracking-wider uppercase"><AnimatedText text={item.prize} /></span>}
                            {item.link && item.link.trim() !== "" && <ExternalLinkIcon className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" />}
                        </div>
                    </div>
                ))}

                {/* Expandable items container */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden bg-white/5 rounded-b-sm"
                        >
                            {hiddenItems.map((item, index) => (
                                <div
                                    key={`${title}-hidden-${index}-${item.title}`}
                                    data-hoverable="true"
                                    onClick={() => onDetailSelect({ ...item, category })}
                                    className="group flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0 bg-black/50 backdrop-blur-sm hover:bg-black/60 p-6 rounded-sm transition-colors"
                                >
                                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 flex-1">
                                        <span className="font-mono text-emerald-600/70 text-xs tracking-widest min-w-[3rem] group-hover:text-emerald-500 transition-colors"><AnimatedText text={item.year} /></span>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors mb-1 md:mb-0 tracking-wide"><AnimatedText text={item.title} /></h4>
                                        </div>
                                    </div>
                                    <div className="mt-2 md:mt-0 md:pl-8 flex items-center justify-between md:justify-end gap-4 min-w-[30%]">
                                        {item.prize && <span className="text-xs text-gray-500 group-hover:text-emerald-400 transition-colors text-right flex-1 tracking-wider uppercase"><AnimatedText text={item.prize} /></span>}
                                        {item.link && item.link.trim() !== "" && <ExternalLinkIcon className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" />}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {showButton && (
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs text-gray-500 hover:text-white tracking-widest uppercase transition-colors p-2"
                    >
                        {isExpanded ? "Close" : "View More"}
                    </button>
                </div>
            )}
        </div>
    );
};

const ResearchSection = ({ content, onDetailSelect, ui }) => {
    return (
        <ContentSection id="research" title={content.research.title}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-xs text-gray-500 tracking-[0.15em] bg-black/40 backdrop-blur-[2px] rounded-sm px-4 py-2 inline-block"><AnimatedText text={content.research.description} /></p>
                </div>

                <ResearchListGroup title={content.research.heading_grants} items={content.research.grants} category="grant" onDetailSelect={onDetailSelect} />
                <ResearchListGroup title={content.research.heading_awards} items={content.research.awards} category="award" onDetailSelect={onDetailSelect} />
            </div>
        </ContentSection>
    )
}


// --- 通常のセクション (Minimal) ---
const ContentSection = ({ id, title, children }) => (
    <section id={id.toLowerCase()} className={`py-24 md:py-32 relative`}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className="text-sm font-normal text-gray-500 text-center mb-24 font-['Syne',sans-serif] tracking-[0.3em] uppercase"
            >
                <AnimatedText text={title} />
            </motion.h2>
            {children}
        </div>
    </section>
);

// --- NewsSection (Tile Layout) ---
const NewsSection = ({ content, onNewsSelect, setPage, ui }) => {
    // Sort news items by date (newest first) - Safe parsing for YYYY.MM.DD
    const parseDate = (dateStr) => {
        if (!dateStr) return new Date(0);
        const parts = dateStr.split('.');
        if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2]);
        return new Date(dateStr);
    };
    const sortedNews = [...content.news.items].sort((a, b) => parseDate(b.date) - parseDate(a.date));

    return (
        <ContentSection id="news" title={content.news.title}>
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-6 min-h-[600px] md:min-h-[500px]">
                {sortedNews.slice(0, 3).map((item, index) => {
                    // First item is large (2x2 on desktop)
                    const isLarge = index === 0;
                    const thumbnail = item.images && item.images.length > 0 ? item.images[0] : null;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            onClick={() => onNewsSelect(item)}
                            data-hoverable="true"
                            className={`
                                relative overflow-hidden group cursor-pointer border border-white/10 p-6 flex flex-col justify-end
                                ${isLarge ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'}
                                bg-neutral-900/40 hover:bg-neutral-800/60 transition-colors
                            `}
                        >
                            {thumbnail ? (
                                <>
                                    <img src={thumbnail} alt="News" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 grayscale hover:grayscale-0" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                                </>
                            ) : (
                                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-[80px] leading-none font-bold text-white">0{index + 1}</span>
                                </div>
                            )}

                            <div className="relative z-10">
                                <p className="text-xs text-emerald-500/80 font-mono mb-2 tracking-widest"><AnimatedText text={item.date} /></p>
                                <h3 className={`${isLarge ? 'text-lg md:text-2xl' : 'text-xs md:text-base'} font-normal text-gray-200 group-hover:text-white transition-colors tracking-wide leading-tight mb-4`}>
                                    <AnimatedText text={item.title} />
                                </h3>
                                <div className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                                    {ui.read_more} <div className="transform group-hover:translate-x-1 transition-transform"><ArrowRightIcon className="w-3 h-3" /></div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            <div className="text-right mt-12">
                <a onClick={() => setPage('all-news')} data-hoverable="true" className="inline-block text-xs text-gray-500 hover:text-white border-b border-transparent hover:border-white pb-1 transition-all cursor-pointer tracking-[0.2em] uppercase">
                    <AnimatedText text={content.news.view_more_button} />
                </a>
            </div>
        </ContentSection>
    );
};

// --- Newsモーダル (Dark Theme) ---
const NewsModal = ({ newsItem, onClose, ui }) => {
    if (!newsItem) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.98, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-black/80 rounded-sm p-8 md:p-12 max-w-3xl w-full border border-white/10 shadow-2xl relative max-h-[90vh] flex flex-col ring-1 ring-white/5"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button data-hoverable="true" onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white z-10 transition-colors bg-black/50 p-2 rounded-full backdrop-blur-sm"><CloseIcon /></button>
                    <div className="overflow-y-auto custom-scrollbar pr-4">
                        <p className="text-xs text-emerald-500 font-mono mb-4 tracking-widest"><AnimatedText text={newsItem.date} /></p>
                        <h2 className="text-2xl font-bold text-gray-100 mb-8 leading-relaxed"><AnimatedText text={newsItem.title} /></h2>
                        <div className="text-sm text-gray-300 whitespace-pre-line prose prose-invert prose-sm leading-8 tracking-wide" dangerouslySetInnerHTML={{ __html: newsItem.fullContent.replace(/\n/g, '<br />') }} />

                        {newsItem.link && (
                            <div className="mt-8 mb-4">
                                <a
                                    href={newsItem.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest font-mono group"
                                >
                                    <span>{ui ? ui.view_website : "VIEW WEBSITE"}</span>
                                    <ExternalLinkIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        )}

                        {newsItem.images && newsItem.images.length > 0 && (
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {newsItem.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`${newsItem.title} image ${index + 1}`}
                                        className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/171717/525252?text=Image+Not+Found'; }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- Detail Modal (Redesigned Minimal) ---
const DetailModal = ({ item, onClose, content, handleDownload, ui }) => {
    if (!item) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-8"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-black/80 rounded-sm max-w-5xl w-full max-h-[85vh] flex flex-col md:flex-row border border-white/10 shadow-2xl relative overflow-hidden ring-1 ring-white/5"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button data-hoverable="true" onClick={onClose} className="absolute top-6 right-6 z-20 text-gray-500 hover:text-white transition-colors bg-black/50 p-2 rounded-full backdrop-blur-sm"><CloseIcon /></button>

                    {/* Image Section */}
                    {item.image && (
                        <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.title || item.name} className="w-full h-full object-cover grayscale opacity-80" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/171717/525252?text=Image+Not+Found'; }} />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-transparent to-transparent opacity-80"></div>
                        </div>
                    )}

                    {/* Content Section */}
                    <div className={`p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col justify-center ${item.image ? 'md:w-1/2' : 'w-full'}`}>
                        <div className="mb-8 flex flex-wrap gap-3 text-xs font-mono text-emerald-500/90 tracking-widest uppercase">
                            {item.year && <span className="border border-emerald-900/50 px-2 py-1 rounded">{item.year}</span>}
                            {item.type && <span className="border border-emerald-900/50 px-2 py-1 rounded">{item.type}</span>}
                            {item.period && <span className="border border-emerald-900/50 px-2 py-1 rounded">{item.period}</span>}
                        </div>

                        <h2 className="text-lg md:text-xl font-normal text-white mb-8 leading-tight tracking-wide font-['Syne',sans-serif]">
                            <AnimatedText text={item.title || item.name} />
                        </h2>

                        {item.prize && (
                            <div className="mb-8 pl-4 border-l border-emerald-500/50">
                                <span className="text-[10px] uppercase text-gray-500 block mb-1 tracking-widest">{item.category === 'grant' ? ui.grant_label : ui.award_label}</span>
                                <p className="text-sm text-emerald-400 font-medium"><AnimatedText text={item.prize} /></p>
                            </div>
                        )}

                        <p className="text-sm text-gray-400 whitespace-pre-line leading-7 tracking-wide mb-8"><AnimatedText text={item.details} /></p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            {item.pdf && (
                                <button
                                    onClick={(e) => handleDownload(e, item.pdf)}
                                    data-hoverable="true"
                                    className="inline-flex items-center gap-3 text-xs text-gray-300 hover:text-white border border-white/20 hover:border-white px-8 py-3 rounded-full transition-all tracking-[0.2em] uppercase group"
                                >
                                    <DownloadIcon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                    <AnimatedText text={content.research.download_button} />
                                </button>
                            )}
                            {item.link && (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-hoverable="true"
                                    className="inline-flex items-center gap-3 text-xs text-gray-300 hover:text-white border border-white/20 hover:border-white px-8 py-3 rounded-full transition-all tracking-[0.2em] uppercase group"
                                >
                                    <ExternalLinkIcon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                    <AnimatedText text={content.activities.site_button} />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};


// --- フッターコンポーネント (Minimal) ---
const Footer = ({ content, setPage, ui }) => {
    const scrollToSection = (itemText) => {
        const targetId = itemText.toLowerCase().replace(/\s+/g, '-');

        const externalLinks = {
            'x-(twitter)': 'https://x.com/F7XUbvdcqB38059',
            'linkedin': 'https://www.linkedin.com/in/kazuhiro-komatsu-37302b289/',
            'instagram': 'https://www.instagram.com/steamkazu/',
            'facebook': 'https://www.facebook.com/share/1AjQu2jF5U/?mibextid=wwXIfr',
            'former-site': 'https://sites.google.com/view/kazuhirokomatsu',
            'advance-lab': 'https://adlab.lne.st/'
        };

        if (externalLinks[targetId]) {
            window.open(externalLinks[targetId], '_blank', 'noopener,noreferrer');
            return;
        }

        const element = document.getElementById(targetId);
        if (element) {
            setPage('home');
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } else if (targetId === 'profile' || targetId === 'vision' || targetId === 'news' || targetId === 'research' || targetId === 'projects' || targetId === 'map' || targetId === 'activities' || targetId === 'contact') {
            // If not found but is a main section, ensure we go home first
            setPage('home');
            setTimeout(() => {
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    const getIcon = (itemText) => {
        const lower = itemText.toLowerCase();
        if (lower.includes('x')) return <TwitterIcon />;
        if (lower.includes('linkedin')) return <LinkedinIcon />;
        if (lower.includes('instagram')) return <InstagramIcon />;
        if (lower.includes('facebook')) return <FacebookIcon />;
        return <ExternalLinkIcon className="w-4 h-4" />;
    };
    return (
        <footer className="py-20 text-gray-500 relative">
            <div className="max-w-4xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mb-20">
                    {content.columns.map((column) => (
                        <div key={column.title}>
                            <h3 className="text-xs font-bold text-gray-700 tracking-[0.2em] uppercase mb-8"><AnimatedText text={column.title} /></h3>
                            <ul className="space-y-4">
                                {column.items.map((item) => (
                                    <li key={item}>
                                        <a data-hoverable="true" onClick={() => scrollToSection(item)} className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer tracking-wider uppercase">
                                            <AnimatedText text={item} />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-white/5 pt-8">
                    <p className="text-left text-gray-700 text-[10px] tracking-widest font-mono">&copy; {new Date().getFullYear()} Kazuhiro Komatsu.</p>
                    <p className="text-left text-gray-800 text-[10px] tracking-widest font-mono uppercase opacity-50">{ui.designed_with}</p>
                </div>
            </div>
        </footer>
    );
};



// --- すべてのプロジェクトページ (Dark Theme) ---
const AllProjectsPage = ({ content, setPage, setSelectedDetail, lang, setLang, setScrollToSectionId, ui }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleBack = () => {
        setScrollToSectionId('projects');
        setPage('home');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-black min-h-screen text-gray-200 relative overflow-hidden"
        >
            <BotanicalSynapse />
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-none z-0"></div>
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-32 relative z-10">
                <div className="flex justify-between items-end mb-20 border-b border-white/10 pb-8">
                    <h1 className="text-xl md:text-3xl font-normal tracking-wider font-['Syne',sans-serif] text-gray-100">
                        <AnimatedText text={content.all_projects_page.title} />
                    </h1>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleBack}
                            data-hoverable="true"
                            className="text-xs text-gray-500 hover:text-white transition-colors tracking-widest uppercase"
                        >
                            <AnimatedText text={ui.back} />
                        </button>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                    {content.projects.items.map((item, index) => (
                        <motion.div
                            key={`project-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => setSelectedDetail(item)}
                            data-hoverable="true"
                            className="group cursor-pointer"
                        >
                            <div className="aspect-video overflow-hidden relative mb-6">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x450/171717/525252?text=Image+Not+Found'; }} />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-mono mb-2 tracking-widest"><AnimatedText text={item.period} /></p>
                                <h3 className="text-lg font-normal text-gray-200 group-hover:text-white transition-colors mb-3"><AnimatedText text={item.title} /></h3>
                                <p className="text-xs text-gray-500 leading-relaxed tracking-wide"><AnimatedText text={item.description} /></p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
const AllNewsPage = ({ content, setPage, setSelectedNews, lang, setLang, setScrollToSectionId, ui }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const parseDate = (dateStr) => {
        if (!dateStr) return new Date(0);
        const parts = dateStr.split('.');
        if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2]);
        return new Date(dateStr);
    };

    const sortedItems = [...content.news.items].sort((a, b) => parseDate(b.date) - parseDate(a.date));

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]); // Scroll to top on page change

    const handleBack = () => {
        setScrollToSectionId('news');
        setPage('home');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-black min-h-screen text-gray-200 relative overflow-hidden"
        >
            <BotanicalSynapse />
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-none z-0"></div>

            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-32 relative z-10">
                <div className="flex justify-between items-end mb-20 border-b border-white/10 pb-8">
                    <h1 className="text-xl md:text-3xl font-normal tracking-wider font-['Syne',sans-serif] text-gray-100">
                        <AnimatedText text={content.news.title} />
                    </h1>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleBack}
                            data-hoverable="true"
                            className="text-xs text-gray-500 hover:text-white transition-colors tracking-widest uppercase"
                        >
                            <AnimatedText text={ui.back} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentItems.map((item, index) => {
                        const thumbnail = item.images && item.images.length > 0 ? item.images[0] : null;
                        return (
                            <motion.div
                                key={`news-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                onClick={() => setSelectedNews(item)}
                                data-hoverable="true"
                                className="group bg-neutral-900/40 border border-white/10 relative overflow-hidden cursor-pointer hover:bg-neutral-800/60 transition-colors aspect-[4/3] flex flex-col justify-end p-6"
                            >
                                {thumbnail && (
                                    <>
                                        <img src={thumbnail} alt="News" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 grayscale hover:grayscale-0" loading="lazy" decoding="async" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                                    </>
                                )}
                                <div className="relative z-10">
                                    <p className="text-xs text-gray-500 font-mono mb-2 tracking-widest"><AnimatedText text={item.date} /></p>
                                    <h3 className="text-lg font-normal text-gray-300 group-hover:text-white transition-colors mb-2 leading-tight line-clamp-2"><AnimatedText text={item.title} /></h3>
                                    <div className="mt-4 text-xs text-gray-600 group-hover:text-gray-400 transition-colors tracking-widest uppercase">
                                        {ui.read_more}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-16">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`w-8 h-8 rounded-full text-xs font-mono transition-colors ${currentPage === i + 1
                                    ? 'bg-white text-black'
                                    : 'bg-neutral-900 text-gray-500 hover:text-white hover:bg-neutral-800'
                                    }`}
                                data-hoverable="true"
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// --- プロジェクトスライダーセクション (Minimal) ---
const ProjectSliderSection = ({ content, setSelectedDetail, setPage, ui }) => {
    const [projectIndex, setProjectIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    };

    const featuredItems = useMemo(() => content.projects.items.filter(item => item.featured), [content.projects.items]);

    const paginate = useCallback((newDirection) => {
        setDirection(newDirection);
        setProjectIndex((prevIndex) => {
            const numItems = featuredItems.length;
            if (numItems === 0) return 0;
            return (prevIndex + newDirection + numItems) % numItems;
        });
    }, [featuredItems.length]);

    useEffect(() => {
        const projectInterval = setInterval(() => paginate(1), 7000);
        return () => clearInterval(projectInterval);
    }, [paginate]);

    return (
        <ContentSection id="projects" title={content.projects.title}>
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-neutral-900/10">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={projectIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "tween", ease: "easeInOut", duration: 0.8 },
                            opacity: { duration: 0.4 }
                        }}
                        className="absolute inset-0 w-full h-full cursor-pointer flex flex-col md:flex-row"
                        onClick={() => setSelectedDetail(featuredItems[projectIndex])}
                        data-hoverable="true"
                    >
                        {/* Image Side */}
                        <div className="w-full md:w-3/5 h-3/5 md:h-full relative overflow-hidden">
                            <img src={featuredItems[projectIndex]?.image || ''} alt={featuredItems[projectIndex]?.title || ''} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-80" loading="lazy" decoding="async" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x675/171717/525252?text=Image+Not+Found'; }} />
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-2/5 h-2/5 md:h-full p-6 md:p-12 flex flex-col justify-center bg-transparent md:border-l border-white/5">
                            <span className="block text-[10px] tracking-[0.3em] text-gray-500 mb-6 uppercase">{ui.featured_project}</span>
                            <h3 className="text-xl md:text-2xl font-normal text-gray-100 mb-4 leading-tight tracking-[0.1em] font-['Syne',sans-serif]"><AnimatedText text={featuredItems[projectIndex]?.title || ''} /></h3>
                            <p className="text-xs text-gray-500 line-clamp-3 tracking-wide leading-7"><AnimatedText text={featuredItems[projectIndex]?.description || ''} /></p>
                            <div className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-700 pb-1 self-start">{ui.click_for_details}</div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-4 right-6 flex gap-4 z-10">
                    <button onClick={(e) => { e.stopPropagation(); paginate(-1); }} className="text-gray-600 hover:text-white transition-colors" data-hoverable="true"><ChevronLeftIcon className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); paginate(1); }} className="text-gray-600 hover:text-white transition-colors" data-hoverable="true"><ChevronRightIcon className="w-4 h-4" /></button>
                </div>
            </div>
            <div className="text-right mt-8">
                <a onClick={() => setPage('all-projects')} data-hoverable="true" className="inline-block text-xs text-gray-500 hover:text-white border-b border-transparent hover:border-white pb-1 transition-all cursor-pointer tracking-[0.2em] uppercase">
                    <AnimatedText text={content.projects.view_all_button} />
                </a>
            </div>
        </ContentSection>
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-4xl mx-auto"
                >
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 md:w-56 md:h-56 bg-neutral-900 rounded-full overflow-hidden grayscale opacity-90 mx-auto md:mx-0 shadow-2xl shadow-black/50 ring-1 ring-white/10">
                            <img
                                src={process.env.PUBLIC_URL + "/images/self.png"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="w-fit mx-auto md:mx-0 text-left">
                            <p className="text-2xl font-normal text-gray-100 mb-2 tracking-[0.05em] font-['Syne',sans-serif] pl-6"><AnimatedText text={currentContent.profile.name} /></p>
                            <p className="text-xs text-emerald-600/80 mb-8 font-mono tracking-widest uppercase pl-6"><AnimatedText text={currentContent.profile.affiliation} /></p>
                            <p className="text-sm text-gray-400 leading-8 tracking-wide mb-10 whitespace-pre-line bg-black/40 backdrop-blur-[2px] rounded-sm px-6 py-4 block"><AnimatedText text={currentContent.profile.description} /></p>
                            <a href={cvUrl} target="_blank" rel="noopener noreferrer" data-hoverable="true" className="inline-block text-xs text-gray-500 border border-gray-800 px-8 py-3 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-500 tracking-[0.2em] uppercase ml-6">
                                <AnimatedText text={currentContent.profile.cv_button} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </ContentSection>

            <ContentSection id="vision" title={currentContent.vision.title}>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
                    <h2 className="text-lg md:text-xl font-normal text-gray-200 leading-relaxed mb-8 tracking-[0.1em]"><AnimatedText text={currentContent.vision.heading} /></h2>
                    <p className="text-sm text-gray-500 leading-8 tracking-wide whitespace-pre-line bg-black/40 backdrop-blur-[2px] rounded-sm px-6 py-4 inline-block"><AnimatedText text={currentContent.vision.description} /></p>
                </motion.div>
            </ContentSection>

            <NewsSection content={currentContent} onNewsSelect={handleNewsSelect} setPage={setPage} ui={currentContent.ui} />

            <ResearchSection content={currentContent} onDetailSelect={setSelectedDetail} ui={currentContent.ui} />

            <ProjectSliderSection
                content={currentContent}
                setSelectedDetail={setSelectedDetail}
                setPage={setPage}
                ui={currentContent.ui}
            />

            <ContentSection id="map" title={currentContent.map.title}>
                <p className="text-center text-xs text-gray-500 mb-12 tracking-[0.2em] uppercase bg-black/40 backdrop-blur-[2px] rounded-sm px-4 py-2 w-fit mx-auto"><AnimatedText text={currentContent.map.description} /></p>
                <div className="relative w-full max-w-4xl mx-auto aspect-video bg-transparent border border-white/5 overflow-hidden rounded-sm grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                    <img src={process.env.PUBLIC_URL + "/images/map.jpg"} alt="World Map" className="w-full h-full object-contain opacity-90 mix-blend-lighten" loading="lazy" decoding="async" />

                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {currentContent.map.locations.slice(1).map((loc, i) => (
                            <motion.line
                                key={i}
                                x1={`${currentContent.map.locations[0].x}%`} y1={`${currentContent.map.locations[0].y}%`}
                                x2={`${loc.x}%`} y2={`${loc.y}%`}
                                stroke="rgba(255, 255, 255, 0.2)"
                                strokeWidth="1.5"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: i * 0.2 }}
                            />
                        ))}
                    </svg>


                    {currentContent.map.locations.map((loc, i) => {
                        const isHub = i === 0;
                        return (
                            <motion.div key={loc.id} onClick={() => setSelectedDetail(loc)} className="absolute cursor-pointer group -translate-x-1/2 -translate-y-1/2" style={{ left: `${loc.x}%`, top: `${loc.y}%` }} data-hoverable="true">
                                <motion.div className="relative flex items-center justify-center">
                                    <div className={`w-4 h-4 border-2 border-white ${isHub ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse' : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]'} rounded-full group-hover:scale-125 group-hover:shadow-[0_0_20px_rgba(255,255,255,1)] transition-all duration-300`} />
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest uppercase bg-black/60 backdrop-blur-sm px-2 py-1 rounded-sm">
                                        {loc.name}
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </ContentSection>

            <ContentSection id="activities" title={currentContent.activities.title}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 max-w-5xl mx-auto">
                    {currentContent.activities.items.map((item, index) => (
                        <motion.div
                            key={`activity-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="group cursor-pointer bg-black/50 backdrop-blur-sm hover:bg-black/60 p-6 rounded-sm transition-colors"
                            onClick={() => setSelectedDetail(item)}
                            data-hoverable="true"
                        >
                            <div className="border-t border-white/10 pt-4 mb-4 flex justify-between items-start">
                                <span className="text-[10px] text-gray-600 font-mono tracking-wider">{item.year}</span>
                                {item.link && <ExternalLinkIcon className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" />}
                            </div>
                            <h3 className="text-sm font-normal text-gray-300 group-hover:text-white transition-colors mb-2 min-h-[2.5rem] tracking-wide"><AnimatedText text={item.title} /></h3>
                            <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors line-clamp-2 tracking-wide"><AnimatedText text={item.event} /></p>
                        </motion.div>
                    ))}
                </div>
            </ContentSection>

            <ContentSection id="contact" title={currentContent.contact.title}>
                <div className="text-center">
                    <p className="text-xs text-gray-500 mb-12 max-w-xl mx-auto whitespace-pre-line leading-8 tracking-wide"><AnimatedText text={currentContent.contact.description} /></p>
                    <div className="flex flex-col items-center gap-8">
                        <motion.a
                            data-hoverable="true"
                            onClick={handleCopyEmail}
                            className="relative flex items-center gap-4 text-gray-300 hover:text-white transition-colors cursor-pointer text-sm md:text-base font-mono tracking-widest group"
                        >
                            <span>{currentContent.contact.email}</span>
                            <span className="text-[10px] text-gray-600 border border-gray-800 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">{currentContent.ui.copy}</span>
                            <AnimatePresence>
                                {copied && <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-emerald-500 text-[10px] tracking-widest uppercase">{currentContent.ui.copied}</motion.span>}
                            </AnimatePresence>
                        </motion.a>

                        <div className="flex gap-8 mt-12 opacity-60 hover:opacity-100 transition-opacity duration-300">
                            <motion.a data-hoverable="true" href="https://x.com/F7XUbvdcqB38059" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><TwitterIcon /></motion.a>
                            <motion.a data-hoverable="true" href="https://www.instagram.com/steamkazu/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon /></motion.a>
                            <motion.a data-hoverable="true" href="https://www.facebook.com/share/1AjQu2jF5U/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon /></motion.a>
                            <motion.a data-hoverable="true" href="https://www.linkedin.com/in/kazuhiro-komatsu-37302b289/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><LinkedinIcon /></motion.a>
                        </div>
                    </div>
                </div>
            </ContentSection>

            <Footer content={currentContent.footer} setPage={setPage} ui={currentContent.ui} />
        </>
    );
};

// --- メインアプリケーションコンポーネント ---
export default function App() {
    const [lang, setLang] = useState('ja');
    const [page, setPage] = useState('home');
    const [selectedNews, setSelectedNews] = useState(null);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [showIntro, setShowIntro] = useState(true);
    const [expandedItem, setExpandedItem] = useState(null);
    const [copied, setCopied] = useState(false);
    const [scrollToSectionId, setScrollToSectionId] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const currentContent = content[lang];
    const cvUrl = "https://drive.google.com/file/d/1LUlTviJPBxVjce3lwcg-6IDZ1YOTdDn9/view?usp=sharing";

    // --- News Routing Logic ---
    const handleNewsSelect = (item) => {
        if (item && item.id) {
            setSearchParams({ news: item.id });
        } else {
            setSelectedNews(item); // Fallback for items without ID
        }
    };

    const handleNewsClose = () => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.delete('news');
            return newParams;
        });
    };

    // Sync URL -> State
    useEffect(() => {
        const newsId = searchParams.get('news');
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
    }, [searchParams, lang]);

    const handleCopyEmail = () => {
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
        const link = document.createElement('a');
        link.href = pdfPath;

        const filename = pdfPath.substring(pdfPath.lastIndexOf('/') + 1);
        link.setAttribute('download', filename);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    return (
        <div className="bg-black text-gray-200 font-['Noto_Sans_JP',_sans-serif] cursor-default md:cursor-none relative selection:bg-emerald-500/30 selection:text-white min-h-screen">
            <AnimatePresence>
                {showIntro && <NodeIntro onFinish={() => setShowIntro(false)} />}
            </AnimatePresence>

            {/* Fixed Background - Always Visible */}
            {!showIntro && <BotanicalSynapse />}

            <AnimatePresence mode="wait">
                {!showIntro && (
                    <motion.div key={page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="relative z-10">
                        <CustomCursor />
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
                                setSelectedDetail={setSelectedDetail}
                                handleCopyEmail={handleCopyEmail}
                                copied={copied}
                            />
                        )}
                        {page === 'all-news' && <AllNewsPage content={currentContent} setPage={setPage} setSelectedNews={handleNewsSelect} lang={lang} setLang={setLang} setScrollToSectionId={setScrollToSectionId} ui={currentContent.ui} />}
                        {page === 'all-projects' && <AllProjectsPage content={currentContent} setPage={setPage} setSelectedDetail={setSelectedDetail} lang={lang} setLang={setLang} setScrollToSectionId={setScrollToSectionId} ui={currentContent.ui} />}
                    </motion.div>
                )}
            </AnimatePresence>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500&display=swap');
                
                .prose {
                    max-width: none;
                }
                /* Custom Scrollbar for Dark Mode */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
}
//test