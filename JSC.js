/* 
 * The AGameAWeek/PMC Template thing
 * Week 4 edition!
*/


/* Brief File Layout
 * 
 *          Tweaks at the Top
 * 
 * Variables
 * Sprite/Sound Loader
 * Default Inks
 * 
 * Menu : Tweak name / brief instructions
 * 
 * 
 * ^^^^^^^^^^^^^^^^
 *          Ignore the Middle
 * Main Loop
 * Loading screen
 * Messy function stuff that can be ignored forever
 * vvvvvvvvvvvvvvv
 * 
 * 
 * 
 *          Code the End
 * Gamey bit goes at the bottom.
 * Don't forget to set $Score, to save highscores.
*/






// Globals
$jscrw=getScreenWidth();
$jscrh=getScreenHeight();

$MyUser = new User();
$MyName=$MyUser.getName();

$j_scaleX=1;
$j_scaleY=1;
$flipat=120;
$flipcred=0;$creds=0;

$titletick=0;$tune=0;

$GameType=2;
$GameMode=-2;
$EndofGame=0;
$MenuIn=-32;
$Debug='';

$kdown=0;

$waiter=0;

$score=0;
$level=0;

// Arrays!  Hurray!
$Palette=[];
$img=[];
$imgData=[];
$sfx=[];
$grid=[];
$pede=[];
$bul=[];

$score_table=[];

50.times() do |n|
    $score_table[n]=0;
end;

Load();


// Defaults
LoadImage(99,'bg_smash_blue',512,1,1);
LoadImage(1,'sprites_001',16,32,32);
LoadImage(2,'sprites_002',16,32,32);

LoadSFX(95);
LoadSFX(97);
LoadSFX(98);
LoadSFX(99);


// Default Colour Scheme
AddInk( 0,  0,  0,  0) //  0 Black
AddInk( 1,  0,  0,128) //  1 Blue
AddInk( 2,  0,  0,255) //  2 Bright Blue
AddInk( 3,128,  0,  0) //  3 Red
AddInk( 4,128,  0,128) //  4 Magenta 
AddInk( 5,128,  0,255) //  5 Mauve
AddInk( 6,255,  0,  0) //  6 Bright Red
AddInk( 7,255,  0,128) //  7 Purple
AddInk( 8,255,  0,255) //  8 Bright Magenta

AddInk( 9,  0,128,  0) //  9 Green
AddInk(10,  0,128,128) // 10 Cyan
AddInk(11,  0,128,255) // 11 Sky Blue
AddInk(12,128,128,  0) // 12 Yellow
AddInk(13,128,128,128) // 13 White 
AddInk(14,128,128,255) // 14 Pastel Blue
AddInk(15,255,128,  0) // 15 Orange
AddInk(16,255,128,128) // 16 Pink
AddInk(17,255,128,255) // 17 Pastel Magenta

AddInk(18,  0,255,  0) // 18 Bright Green
AddInk(19,  0,255,128) // 19 Sea Green
AddInk(20,  0,255,255) // 20 Bright Cyan
AddInk(21,128,255,  0) // 21 Lime
AddInk(22,128,255,128) // 22 Pastel Green
AddInk(23,128,255,255) // 23 Pastel Cyan
AddInk(24,255,255,  0) // 24 Bright Yellow
AddInk(25,255,255,128) // 25 Pastel Yellow
AddInk(26,255,255,255) // 26 Bright White



Font(32)


// -=-=-=-=-=-=-=-=-
//  Menu Stuff         (Up top : once it's done I can ignore it)
// -=-=-=-=-=-=-=-=-
SetColor(0,0,60)
DrawImg(1,0,0,200);

def RunMenu(delta)    
    Options=3

    
    ResetDraw()
    SetSize(2);
    DrawImg(99,(($jscrw-((40*3)+20))/2),$jscrh/2+44,0)
    
    ResetDraw()
    if ($MenuIn<0) $MenuIn=$MenuIn+(delta);end;
    if ($MenuIn>0) $MenuIn=0;end;
    
    Ribbon(0,$jscrw*.25,64,"Centipede",24,15,26,$MenuIn,1,0.75)
    Ribbon(1,$jscrw-(20*3)-10,$jscrh*.5,"Sidebar?",26,0,0,-$MenuIn,3,0.5)
    Ink(15);font(32)
    text(($jscrw-70)-($MenuIn*8),64,"HTML5",1,1)
    
    Ribbonb(0,40,$jscrh-16,"Z to start, Cursors to move. Autofire",0,26,14,-$MenuIn*2,0.7,0.2)
    font(32);
    x=(($jscrw-((40*3)+20))/2)
    y=((($jscrh/2)+64)-(Options*20))-($MenuIn*16)
    
    Ink(14);if ($GameType==1) ink(26);end;
    ShadowText(x,y,"Easy",1,1);y=y+40
    Ink(14);if ($GameType==2) ink(26);end;
    ShadowText(x,y,"Normal",1,1);y=y+40
    Ink(14);if ($GameType==3) ink(26);end;
    ShadowText(x,y,"Hard",1,1);y=y+40
    
    if (playkey(0) && $kdown==0) $GameType=$GameType-1;$kdown=1;playsfx(99);end;
    if (playkey(8) && $kdown==0) $GameType=$GameType+1;$kdown=2;playsfx(99);end;

    if ((playkey(10) || playkey(11)) && $kdown==0) $GameMode=10;$kdown=3;playsfx(98);end; 
    if ($GameType<1) $GameType=Options;end;
    if ($GameType>Options) $GameType=1;end;

    Font(16);Ink(26)
    10.times() do |n|
        d=240-(n*14)
        if ($GameType==1) SetColor(d,d,d/4);end;
        if ($GameType==2) SetColor(d,d/2,d/4);end;
        if ($GameType==3) SetColor(d,d/4,d/4);end;
            
        Text($jscrw-30,(108+($MenuIn*40))+(n*26),PadRight($score_table[n+(($GameType-1)*10)],'0',8),:right,0)
    end;
    
    if ($but.getmousex()>$jscrw-120 && $but.getmousey()<80 && $MenuIn==0)
        ink(15)
        FillRoundedRect($jscrw/2,$jscrh/2,$jscrw*0.8,$jscrh*0.8,38,1,1)
        ink(24)
        FillRoundedRect($jscrw/2,$jscrh/2,($jscrw*0.8)-32,($jscrh*0.8)-32,32,1,1)
        
        ink(0);font(20)
        y=80;
        Text($jscrw/2,y,"PlayMyCode.com uses Quby to",1,1);y=y+22
        Text($jscrw/2,y,"generate HTML5 based games.",1,1);y=y+32
        Text($jscrw/2,y,"",1,1);y=y+24
        Text($jscrw/2,y,"Simply log in, click Build, and start coding.",1,1);y=y+16
        Text($jscrw/2,y,"",1,1);y=y+30
        Text($jscrw/2,y,"Once you're done, you can embed",1,1);y=y+22
        Text($jscrw/2,y,"your game onto your own site.",1,1);y=y+58
        font(32)
        Text($jscrw/2,y,"PlayMyCode.com",1,1);y=y+42
        font(20)
        Text($jscrw/2,y,"Like YouTube, but for Games!",1,1);y=y+28
        font(12)
        Text($jscrw/2,y,"Game created by Jayenkai : AGameAWeek.com",1,1);
    end;
    
    
ResetDraw();
$flipat=$flipat-delta
if ($flipat<-75) $flipat=75;end;
if ($flipat>-8 && $flipat<8) $creds=rand(12,23.9).floor();end;
    $flipcred=dcos($flipat*1.2)*64;
    if ($flipcred<32) $flipcred=32;end;
    
    a=($creds/16).floor()+1;b=($creds%16)*64;
    16.times() do |x|
        DrawImg(a,($jscrw-(16*16))+(x*16),(($jscrh-48)-$MenuIn)+$flipcred,b+x)
    end;
    
end;



// Main Loop
onEachFrame() do |delta|
$but=getControls();
fill( 0, 0, 0 )
    if ($GameMode==-2) Title(delta); end;
    if ($GameMode==-1) GotoMenu(delta); end;
    if ($GameMode==0) RunMenu(delta); end;

    if ($GameMode==10) GotoGame(delta); end;
    if ($GameMode==11) RunGame(delta); end;
    if ($GameMode==12) EndGame(delta); end;


    if (!(playkey(0) || playkey(3) || playkey(5) || playkey(8) || playkey(10) || playkey(11) || playkey(12) || playkey(13) )) $kdown=0;end;
    ink(26);font(12);Shadowtext($jscrw-1,1,$debug,:right,0);
end

def Title(delta)
    ResetDraw()
            
    if ($titletick>140)
        SetSize(2);
        d=($titletick-140)*3
        if (d>255) d=255;end;
        SetColor(d,d,d)
        DrawImg(99,(($jscrw-((40*3)+20))/2),$jscrh/2+44,0)
    end;
    if ($titletick>30 && $tune==0) PlaySFX(95);$tune=1;end;
    $titletick=$titletick+delta
    if ($titletick>240) $GameMode=-1; end;
    
    in=($titletick-60)
    if ($titletick>59 and $titletick<161) in=0;end;
    if ($titletick>160) in=$titletick-160;end;
    if ($titletick<240)
        Ribbon(0,$jscrw*.5,$jscrh*.25,"AGameAWeek.com",24,15,0,in,1.5,0.8)
        Ribbon(0,$jscrw*.5,$jscrh*.75,"PlayMyCode.com",8,26,0,-in,1.5,0.8)
    end;
    
end;

def GotoMenu(delta)
    $GameMode=0;
    $MenuIn=-32;
    $kdown=1;
    Debug('');
end;





// -=-=-=-=-=-=-=-=-
//  Function Stuff       (Middle : Pretty much ignore, always!)
// -=-=-=-=-=-=-=-=-

// Stuffs
def Debug(ftxt)
    $Debug=ftxt;
end;

def Save()
    savetext='';
    50.times() do |n|
        savetext=savetext+PadRight($score_table[n],' ',32);
    end;
    $myUser.saveGame(savetext);
end;

def Load()
    loadtext=$myUser.LoadGame();
    if (loadtext!=null)
    50.times() do |n|
        loadbit='';
        32.times() do |m|
            c=loadtext.GetChar((n*32)+m);
            if (c!=' ' && c!=null) loadbit=loadbit+c;end;
            $score_table[n]=loadbit;
        end;
    end;
    end;
end;

def dsin(fdeg) return (fdeg/57.29577866666166).sin(); end;
def dcos(fdeg) return (fdeg/57.29577866666166).cos(); end;
def rnd(fa,fb) return rand(fa,fb+0.999999).floor();end;

// Doodley

def Ribbon(horvert,cx,cy,txt,ink1,ink2,ink3,in,size,alpha)
    Ink(ink2,alpha)
    if (horvert==0) FillRect((cx-$jscrw)+(in*64),(cy-(20*size)),$jscrw*2,(40*size)); end;
    if (horvert==1) FillRect((cx-(20*size)),(cy-$jscrh)+(in*64),(40*size),$jscrh*2); end;

    Ink(ink1,alpha)
    if (horvert==0) 
        FillRect((cx-$jscrw)-(in*48),(cy-(20*size))+in,$jscrw*2,(4))
        FillRect((cx-$jscrw)-(in*32),(cy+((20*size)-4))-in,$jscrw*2,(4))
    end;
    if (horvert==1) 
        FillRect((cx-(20*size))-in,(cy-$jscrh)-(in*48),(4),$jscrh*2)
        FillRect((cx+((20*size)-4))+in,(cy-$jscrh)-(in*32),(4),$jscrh*2)
    end;
    
    Font(32);
    Ink(ink3)
    if (horvert==0) ShadowText(cx-(in*16),cy,txt,1,1);end;
//    if (horvert=1) ShadowText(cx-(in*16),cy,txt,1,1);end;
        
end;


def Ribbonb(horvert,cx,cy,txt,ink1,ink2,ink3,in,size,alpha)
    Ink(ink2,alpha)
    if (horvert==0) FillRect((cx-$jscrw)+(in*64),(cy-(20*size)),$jscrw*2,(40*size)); end;
    if (horvert==1) FillRect((cx-(20*size)),(cy-$jscrh)+(in*64),(40*size),$jscrh*2); end;

    Ink(ink1,alpha)
    if (horvert==0) 
        FillRect((cx-$jscrw)-(in*48),(cy-(20*size))+in,$jscrw*2,(4))
        FillRect((cx-$jscrw)-(in*32),(cy+((20*size)-4))-in,$jscrw*2,(4))
    end;
    if (horvert==1) 
        FillRect((cx-(20*size))-in,(cy-$jscrh)-(in*48),(4),$jscrh*2)
        FillRect((cx+((20*size)-4))+in,(cy-$jscrh)-(in*32),(4),$jscrh*2)
    end;
    
    Font(16);
    Ink(ink3)
    if (horvert==0) ShadowText(cx-(in*16),cy,txt,0,1);end;
//    if (horvert=1) ShadowText(cx-(in*16),cy,txt,1,1);end;
        
end;

// Palettey

def AddInk(n,r,g,b)
    $Palette[(n*3)+1]=r;
    $Palette[(n*3)+2]=g;
    $Palette[(n*3)+3]=b;
end;
def Ink(n)
    SetColor($Palette[(n*3)+1],$Palette[(n*3)+2],$Palette[(n*3)+3]);
end;
def Ink(n,alpha)
    SetColor($Palette[(n*3)+1],$Palette[(n*3)+2],$Palette[(n*3)+3],alpha);
end;

// Wordy
def Text(fx,fy,ftxt,fcx,fcy)
    FillText(ftxt,fx,fy,fcx,fcy)
end;
def ShadowText(fx,fy,ftxt,fcx,fcy)
    SetColor(0,0,0) do
        FillText(ftxt,fx+1,fy+1,fcx,fcy)
    end;
    FillText(ftxt,fx,fy,fcx,fcy)
end;
def font(size)
    setFont( 'Arial', size,'bold');// Yeah, I'm lazy, so what!!?
end;

def PadRight(ftxta,pad,len)
    ftxt=''+ftxta;
    while (ftxt.length()<len) 
        ftxt=pad+ftxt;
    end;
return ftxt;
end;

// Picturey

def LoadImage(n,filename,framesize,framesX,framesY)
    filename=filename+'.png';
    $img[n]=new Image(filename);
    
    $imgData[(n*10)+0]=frameSize
    $imgData[(n*10)+1]=framesX
    $imgData[(n*10)+2]=framesY
end;

def DrawImg(n,x,y,frame)
    sx=0;sy=0;sz=$imgData[(n*10)+0]
    if (frame>0)
        sx=((frame % $imgData[(n*10)+1]).floor())*sz;
        sy=((frame / $imgData[(n*10)+1]).floor())*sz;
    end;

    if (frame>$imgData[(n*10)+1]*$imgData[(n*10)+2]) frame=$imgData[(n*10)+1]*$imgData[(n*10)+2]; end;
    DrawImage($img[n],sx,sy,sz,sz,x,y,sz*$j_scaleX,sz*$j_scaleY,1)
end;

def SetSize(fx)
    $j_scaleX=fx;$j_scaleY=fx;
end;
def SetSize(fx,fy)
    $j_scaleX=fx;$j_scaleY=fy;
end;

def ResetDraw()
    SetColor(255,255,255,1);
    SetSize(1);
    Font(32);
end;


// SFX
def LoadSFX(fn)
    $sfx[fn]=new sound(PadRight(fn,'0',3)+'.mp3');
end;

def PlaySFX(fn)
    if ($sfx[fn]==null) LoadSFX(fn);end;
    if ($sfx[fn]) $sfx[fn].Play();end;
end;


// Keys
def PlayKey(fn)
    if (fn==0) return ($but.isKeyDown('up') || $but.isKeyDown('w') ); end; 
    if (fn==8) return ($but.isKeyDown('down') || $but.isKeyDown('s') ); end; 
        
    if (fn==3) return ($but.isKeyDown('left') || $but.isKeyDown('a') ); end; 
    if (fn==5) return ($but.isKeyDown('right') || $but.isKeyDown('d') ); end; 

    if (fn==10) return ($but.isKeyDown('z') || $but.isKeyDown('space') || $but.isKeyDown('enter') || $but.isKeyDown('j') ); end; 
    if (fn==11) return ($but.isKeyDown('x') || $but.isKeyDown('k') ); end; 
    if (fn==12) return ($but.isKeyDown('c') || $but.isKeyDown('l') ); end; 
    if (fn==13) return ($but.isKeyDown('v') || $but.isKeyDown('i') ); end; 

    if (fn==1) return ($but.isKeyDown('backspace') || $but.isKeyDown('tab') ); end; 
end;

// -=-=-=-=-=-=-=-=-
//       Game             (Hit End to skip to the bottom, do codeystuff)
// -=-=-=-=-=-=-=-=-

def EndGame(delta)
    
    alpha=($waiter)/40
    if (alpha<0) alpha=0;end;
    if (alpha>0.7) alpha=0.7;end;
        
    fill(0,0,0,alpha)
    
    $waiter=$waiter+delta;
    usewait=($waiter-20)*2;
    if (usewait>0) usewait=0;end;
    if ($waiter>160) usewait=($waiter-160)*3; end;
        
    put=10;
    10.times() do |n|
        if ($score>$score_table[n+(($GameType-1)*10)] && put==10) put=n;end;
    end;
        
    Ribbon(0,$jscrw*.25,$jscrh*.4,"Game Over",6,3,6,-usewait,2,0.5)    
    Ribbon(0,$jscrw*.7,$jscrh*.6,"Score : "+$score,2,11,26,usewait,1,0.7)
    
if (put<10) 
    nth='First';
    if (put==1) nth='Second';end;
    if (put==2) nth='Third';end;
    if (put==3) nth='Forth';end;
    if (put==4) nth='Fifth';end;
    if (put==5) nth='Sixth';end;
    if (put==6) nth='Seventh';end;
    if (put==7) nth='Eighth';end;
    if (put==8) nth='Ninth';end;
    if (put==9) nth='Tenth';end;

    Ribbon(0,$jscrw*.5,($jscrh*.8)+((usewait.abs())*4),"Highscore : "+nth,9,18,26,-usewait,1,0.4)
end;


    if ($waiter>180)
        if (put<10) 
            10.times() do |n|
                m=9-n;
                if (m<10 && m>put) $score_table[m+(($GameType-1)*10)]=$score_table[(m-1)+(($GameType-1)*10)];end;
            end;
            $score_table[put+(($GameType-1)*10)]=$score;
        end;
        
        Save();
        $GameMode=-1; $waiter=0;
    end;
end;

def GetMore()
        
    16.times() do |p|
        long=rnd(4,8);
        10.times() do |b|
            $pede[((p*10)+b)*4]=0;
        end;
        off=rnd(1,16);
        long.times() do |b|
            ID=((p*10)+b)*4;
            $pede[ID]=-2;
            $pede[ID+1]=(b+off)*16;
            $pede[ID+2]=0-(16+(32*p));
            $pede[ID+3]=((b%4)*4)+4;
            if (b==0) $pede[ID+3]=0;end;
        end;
    end;
    $lspd=1;
end;

def GotoGame(delta)
    Debug('');
    $score=0;$level=1;
    $GameMode=11;
    $EndofGame=0;
    $waiter=0;
    
    $gw=$jscrw/16;
    $gh=$jscrh/16;
    
    $gw.times() do |x|
        ($gh-6).times() do |y|
            ID=(y+2)*50+x;
            $grid[ID]=0;
            if (rnd(0,48-($GameType*4))==1) $grid[ID]=4;end;
        end;
    end;


    $px=$jscrw/2;
    $psx=0;
    $spd=($GameType*0.5)+0.75;
    $lspd=$spd;
    $ftick=3;
    $rapid=-1;
    50.times() do |n|
        $bul[n*10]=0;
    end;
    GetMore();
end;


def RunGame(delta)
    ResetDraw();
    SetSize(2);
    DrawImg(99,$jscrw/2,$jscrh/2,0)
    
ResetDraw();
SetColor(0,255,0);SetAlpha(0.5);
DrawRect(0,0,$jscrw,8);
SetColor(180,0,0);SetAlpha(0.5);
DrawRect(0,$jscrh-40,$jscrw,40);


ResetDraw();
    $gw.times() do |x|
        $gh.times() do |y|
            ID=y*50+x;            
            if ($grid[ID]>0)
                SetColor(255,255,255)
                DrawImg(2,x*16,y*16,269);
                if ($grid[ID]==5) DrawImg(2,x*16,y*16,317) ;end;
                SetColor(0,0,60)
                if ($grid[ID]==3) DrawImg(1,x*16,y*16,200) ;end;
                if ($grid[ID]==2) DrawImg(1,x*16,y*16,264) ;end;
                if ($grid[ID]==1) DrawImg(1,x*16,y*16,328) ;end;
            end;
        end;
    end;
    pods=0;
    ResetDraw();
    16.times() do |p|
        10.times() do |b|
            ID=((p*10)+b)*4;
            if ($pede[ID]!=0)
                pods=pods+1;
                mx=(($pede[ID+1]+8)/16).floor()
                my=($pede[ID+2]/16).floor()
                
                if ($pede[ID+2]>$jscrh-32) $endofgame=1;end;
                    
                if (mx>0 && mx<$gw && my>0 && my<$gh)
                    if ($grid[my*50+mx]>0)
                        $pede[ID]=0-$pede[ID];
                        $pede[ID+2]=$pede[ID+2]+16;
                    end;
                    50.times() do |e|
                        if ($bul[e*10]==1 && ($bul[(e*10)+1]-$pede[ID+1]).abs()<12 && ($bul[(e*10)+2]-$pede[ID+2]).abs()<18)
                            $Score=$Score+5;
                            if (b==0)$Score=$Score+25;end;
                                
                            $pede[ID]=0;
                            if (rnd(0,4)<3)
                                $grid[my*50+mx]=4;
                                if (rnd(0,7)<2) $grid[my*50+mx]=5;end;
                            end;
                            $bul[e*10]=0;
                            $lspd=$lspd+0.0025;
                        end;
                    end;
                end;
                    
                $pede[ID+1]=$pede[ID+1]+($pede[ID]*$spd*$lspd*delta)
                if ($pede[ID+1]<16 && $pede[ID]<0) $pede[ID]=2;$pede[ID+2]=$pede[ID+2]+16;end;
                if ($pede[ID+1]>$jscrw-16 && $pede[ID]>0) $pede[ID]=-2;$pede[ID+2]=$pede[ID+2]+16;end;
                
                no=$pede[ID+3];
                
                $pede[ID+3]=(($pede[ID+3]-4)%15)+5;
                if (no==0) $pede[ID+3]=0;end;
                if (b==0) $pede[ID+3]=0;end;
                if ($pede[ID]<0) DrawImg(2,$pede[ID+1],$pede[ID+2],264+$pede[ID+3]/4);end;
                if ($pede[ID]>0) DrawImg(2,$pede[ID+1],$pede[ID+2],272+$pede[ID+3]/4);end;
            end;
        end;
    end;
    
 bfree=-1;
 $ftick=$ftick-delta;
 
50.times() do |e|
    if ($bul[e*10]>0)
        ID=e*10;
        $bul[ID+2]=$bul[ID+2]-(7*delta);
        if ($bul[ID+2]<-16)$bul[ID]=0;end;
        drawimg(2,$bul[ID+1],$bul[ID+2],271);
        
        mx=(($bul[ID+1]+8)/16).floor()
        my=($bul[ID+2]/16).floor()
                
        if (mx>0 && mx<$gw && my>0 && my<$gh)
            if ($grid[my*50+mx]>0)
                $Score=$Score+5;
                $bul[ID]=0;
                if ($grid[my*50+mx]==5) $rapid=50;$Score=$Score+25;end;
                $grid[my*50+mx]=$grid[my*50+mx]-1;
            end;
        end;
    end;
    if ($bul[e*10]==0) bfree=e;end;
end;
//if ((playkey(10)==0 && playkey(0)==0)) $ftick=-1;end;
if ($ftick>0) bfree=-1; end;
    
if ( bfree>-1) 
    $ftick=15;
    if ($rapid>0) $ftick=5;$rapid=$rapid-1;end;
    $bul[bfree*10]=1;
    $bul[(bfree*10)+1]=$px;
    $bul[(bfree*10)+2]=$jscrh-36;
end;

    ResetDraw();
    DrawImg(2,$px,$jscrh-40,270);
    
    if (playkey(3)) $psx=$psx-0.7;end;
    if (playkey(5)) $psx=$psx+0.7;end;
    if (playkey(3)==0 && $psx<0) $psx=$psx+0.5;if ($psx>0) $psx=0;end;end;
    if (playkey(5)==0 && $psx>0) $psx=$psx-0.5;if ($psx<0) $psx=0;end;end;
    
    if ($psx<-8) $psx=-8;end;
    if ($psx>8) $psx=8;end;
    
    $px=$px+$psx*delta;
    if ($px<16) $px=16;end;
    if ($px>$jscrw-16) $px=$jscrw-16;end;

    ink(26,0.8);font(12);
    Shadowtext(1,1,'[DEL] to quit',0,0);
    
    ink(22,1);font(16)
    Shadowtext($jscrw*.25,$jscrh-4,'Score : '+PadRight($score,'0',8),1,:bottom);
    Shadowtext($jscrw*.75,$jscrh-4,'Pods : '+PadRight(pods,'0',3),1,:bottom);

if (pods==0) GetMore();$spd=$spd+0.25;$Score=$score+1000;end;


    // For the minute, no pause..  must fix
    if (playkey(1) && $EndofGame==0) $EndofGame=99; end;
    if ($EndofGame!=0) EndGame(delta);end;
end;



